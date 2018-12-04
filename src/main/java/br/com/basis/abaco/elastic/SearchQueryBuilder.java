package br.com.basis.abaco.elastic;

import br.com.basis.abaco.domain.User;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class SearchQueryBuilder {


    private ElasticsearchTemplate elasticsearchTemplate;

    @Autowired
    public SearchQueryBuilder(ElasticsearchTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }


    public Page<User> user(String text, Pageable pageable) throws IOException {


        QueryBuilder query = QueryBuilders.boolQuery()
            .should(
                QueryBuilders.queryStringQuery(text)
                    .lenient(true)
                    .field("email")
                    .field("firstName")
                    .field("authorities.name")
                    .field("organizacoes.nome")
                    .field("tipoEquipe.nome")
                    .field("lastName")
            ).should(QueryBuilders.queryStringQuery("*" + text + "*")
                .lenient(true)
                .field("email")
                .field("firstName")
                .field("authorities.name")
                .field("organizacoes.nome")
                .field("tipoEquipe.nome")
                .field("lastName"));

        NativeSearchQuery build = new NativeSearchQueryBuilder()
            .withQuery(query)
            .withPageable(pageable)
            .build();


        return elasticsearchTemplate.queryForPage(build, User.class);
    }


}
