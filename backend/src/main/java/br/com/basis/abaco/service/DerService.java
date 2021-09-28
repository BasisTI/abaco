package br.com.basis.abaco.service;

import java.util.ArrayList;
import java.util.List;

import br.com.basis.abaco.domain.Der;
import br.com.basis.abaco.domain.VwDer;
import br.com.basis.abaco.repository.search.DerSearchRepository;
import br.com.basis.abaco.repository.search.VwDerSearchRepository;
import br.com.basis.dynamicexports.service.DynamicExportsService;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.histogram.Histogram;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.aggregations.bucket.terms.TermsBuilder;
import org.hibernate.criterion.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.SearchQuery;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.basis.abaco.repository.DerRepository;
import br.com.basis.abaco.service.dto.DropdownDTO;

import static org.elasticsearch.index.query.QueryBuilders.matchQuery;
import static org.elasticsearch.index.query.QueryBuilders.termsQuery;

@Service
@Transactional
public class DerService {

    private final DerRepository derRepository;
    private final ElasticsearchTemplate elasticsearchTemplate;
    private final DynamicExportsService dynamicExportsService;

    public DerService(DerRepository derRepository, ElasticsearchTemplate elasticsearchTemplate, DynamicExportsService dynamicExportsService) {
        this.derRepository = derRepository;
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.dynamicExportsService = dynamicExportsService;
    }

    @Transactional(readOnly = true)
    public List<DropdownDTO> getDerByFuncaoDadosIdDropdown(Long idFuncaoDados) {
       List<DropdownDTO> lstDersDrop = new ArrayList<>();
        List<Der> lstDers = derRepository.getDerByFuncaoDadosIdDropdown(idFuncaoDados);
        lstDers.forEach(der -> {
            DropdownDTO dropdownDer;
            if(der.getNome() == null || der.getNome().isEmpty()){
                dropdownDer = new br.com.basis.abaco.service.dto.DropdownDTO(der.getId(),der.getValor().toString());
            }else {
                dropdownDer = new br.com.basis.abaco.service.dto.DropdownDTO(der.getId(),der.getNome());
            }
            lstDersDrop.add(dropdownDer);
        });
        return lstDersDrop;
    }

    @Transactional(readOnly = true)
    public List<DropdownDTO> getDerByFuncaoTransacaoIdDropdown(Long idFuncaoTransacao) {
        List<DropdownDTO> lstDersDrop = new ArrayList<>();
        List<Der> lstDers = derRepository.getDerByFuncaoTransacaoIdDropdown(idFuncaoTransacao);
        lstDers.forEach(der -> {
            DropdownDTO dropdownDer;
            if(der.getNome() == null || der.getNome().isEmpty()){
                dropdownDer = new br.com.basis.abaco.service.dto.DropdownDTO(der.getId(),der.getValor().toString());
            }else {
                dropdownDer = new br.com.basis.abaco.service.dto.DropdownDTO(der.getId(),der.getNome());
            }
            lstDersDrop.add(dropdownDer);
        });
        return lstDersDrop;
    }

    public List<VwDer> bindFilterSearchDersSistemaFuncaoDados(String nome, Long idSistema) {
        QueryBuilder queryBuilderNome = QueryBuilders.boolQuery()
            .must(QueryBuilders.wildcardQuery("nome", "*"+nome+"*"));
        QueryBuilder queryBuilderSistemaFD = QueryBuilders.boolQuery()
            .must(QueryBuilders.matchQuery("idSistemaFD", idSistema));


        QueryBuilder qb = QueryBuilders.boolQuery()
            .must(queryBuilderNome)
            .must(queryBuilderSistemaFD);

        SearchQuery searchQuery = new NativeSearchQueryBuilder()
            .withQuery(qb)
            .withPageable(dynamicExportsService.obterPageableMaximoExportacao())
            .build();
        Page<VwDer> page = elasticsearchTemplate.queryForPage(searchQuery, VwDer.class);

        return page.getContent();
    }

    public List<VwDer> bindFilterSearchDersSistemaFuncaoTransacao(String nome, Long idSistema) {
        QueryBuilder queryBuilderNome = QueryBuilders.boolQuery()
            .must(QueryBuilders.wildcardQuery("nome", "*"+nome+"*"));
        QueryBuilder queryBuilderSistemaFT = QueryBuilders.boolQuery()
            .must(QueryBuilders.matchQuery("idSistemaFT", idSistema));

        QueryBuilder qb = QueryBuilders.boolQuery()
            .must(queryBuilderNome)
            .must(queryBuilderSistemaFT);

        SearchQuery searchQuery = new NativeSearchQueryBuilder()
            .withQuery(qb)
            .withPageable(dynamicExportsService.obterPageableMaximoExportacao())
            .build();
        Page<VwDer> page = elasticsearchTemplate.queryForPage(searchQuery, VwDer.class);
        return page.getContent();
    }
}
