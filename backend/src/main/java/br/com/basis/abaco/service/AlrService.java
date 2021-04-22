package br.com.basis.abaco.service;

import br.com.basis.abaco.domain.VwAlr;
import br.com.basis.abaco.domain.VwRlr;
import br.com.basis.abaco.repository.AlrRepository;
import br.com.basis.abaco.repository.search.AlrSearchRepository;
import br.com.basis.abaco.repository.search.VwAlrSearchRepository;
import br.com.basis.dynamicexports.service.DynamicExportsService;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.springframework.data.domain.Page;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.SearchQuery;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AlrService {

    private final AlrRepository alrRepository;
    private final AlrSearchRepository alrSearchRepository;
    private final ElasticsearchTemplate elasticsearchTemplate;
    private final DynamicExportsService dynamicExportsService;
    private final VwAlrSearchRepository vwAlrSearchRepository;

    public AlrService(AlrRepository alrRepository, AlrSearchRepository alrSearchRepository, ElasticsearchTemplate elasticsearchTemplate, DynamicExportsService dynamicExportsService, VwAlrSearchRepository vwAlrSearchRepository){
        this.alrRepository = alrRepository;
        this.alrSearchRepository = alrSearchRepository;
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.dynamicExportsService = dynamicExportsService;
        this.vwAlrSearchRepository = vwAlrSearchRepository;
    }

    public List<VwAlr> bindFilterSearchAlrsSistema(String nome, Long idSistema) {
        QueryBuilder queryBuilderNome = QueryBuilders.boolQuery()
            .must(QueryBuilders.wildcardQuery("nome", "*"+nome+"*"));
        QueryBuilder queryBuilderSistema = QueryBuilders.boolQuery()
            .must(QueryBuilders.matchQuery("idSistema", idSistema));


        QueryBuilder qb = QueryBuilders.boolQuery()
            .must(queryBuilderNome)
            .must(queryBuilderSistema);

        SearchQuery searchQuery = new NativeSearchQueryBuilder()
            .withQuery(qb)
            .withPageable(dynamicExportsService.obterPageableMaximoExportacao())
            .build();
        Page<VwAlr> page = elasticsearchTemplate.queryForPage(searchQuery, VwAlr.class);

        return page.getContent();
    }
}
