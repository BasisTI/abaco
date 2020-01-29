package br.com.basis.abaco.service;

import br.com.basis.abaco.utils.StringUtils;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.springframework.stereotype.Service;

import java.util.Set;

import static org.elasticsearch.index.query.QueryBuilders.nestedQuery;

@Service
public class AnaliseService extends BaseService {

    public void bindFilterSearch(String identificador, String sistema, String metodo, String organizacao, String equipe, String usuario, Set<Long> equipesIds, BoolQueryBuilder qb) {
        mustMatchPhaseQuery(identificador, qb, "identificadorAnalise");
        mustTermQuery(sistema, qb, "sistema.id");
        mustMatchPhaseQuery(metodo, qb, "metodoContagem");
        mustTermQuery(organizacao, qb, "organizacao.id");

        if (!StringUtils.isEmptyString((equipe))) {
            BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery()
                    .should(QueryBuilders.termsQuery("equipeResponsavel.id", equipe))
                    .should(QueryBuilders.termsQuery("compartilhadas.equipeId", equipe));
            qb.must(boolQueryBuilder);
        } else if (equipesIds != null && equipesIds.size() > 0) {
            BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery().should(QueryBuilders.termsQuery("equipeResponsavel.id", equipesIds)).should(QueryBuilders.termsQuery("compartilhadas.equipeId", equipesIds));
            qb.must(boolQueryBuilder);
        }
        if (!StringUtils.isEmptyString((usuario))) {
            qb.must(nestedQuery("users", QueryBuilders.boolQuery().should(QueryBuilders.termQuery("users.id", usuario))));
        }

    }
}
