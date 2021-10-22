package br.com.basis.abaco.service;

import br.com.basis.abaco.domain.Alr;
import br.com.basis.abaco.domain.VwAlr;
import br.com.basis.abaco.domain.VwAlrAll;
import br.com.basis.abaco.repository.AlrRepository;
import br.com.basis.abaco.repository.search.VwAlrAllSearchRepository;
import br.com.basis.abaco.service.dto.DropdownDTO;
import br.com.basis.dynamicexports.service.DynamicExportsService;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.springframework.data.domain.Page;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.SearchQuery;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class AlrService {

    private final ElasticsearchTemplate elasticsearchTemplate;
    private final DynamicExportsService dynamicExportsService;
    private final AlrRepository alrRepository;

    private final VwAlrAllSearchRepository vwAlrAllSearchRepository;

    public AlrService(ElasticsearchTemplate elasticsearchTemplate, DynamicExportsService dynamicExportsService, AlrRepository alrRepository, VwAlrAllSearchRepository vwAlrAllSearchRepository){
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.dynamicExportsService = dynamicExportsService;
        this.alrRepository = alrRepository;
        this.vwAlrAllSearchRepository = vwAlrAllSearchRepository;
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

    @Transactional(readOnly = true)
    public List<DropdownDTO> getAlrByFuncaoTransacaoIdDropdown(Long idFuncaoTransacao) {
        List<DropdownDTO> lstAlrDrop = new ArrayList<>();
        List<Alr> lstAlrs = alrRepository.getAlrByFuncaoTransacaoIdDropdown(idFuncaoTransacao);
        lstAlrs.forEach(alr -> {
            DropdownDTO dropdownAlr;
            if(alr.getNome() == null || alr.getNome().isEmpty()){
                dropdownAlr = new br.com.basis.abaco.service.dto.DropdownDTO(alr.getId(),alr.getValor().toString());
            }else {
                dropdownAlr = new br.com.basis.abaco.service.dto.DropdownDTO(alr.getId(),alr.getNome());
            }
            lstAlrDrop.add(dropdownAlr);
        });
        return lstAlrDrop;
    }

    @Transactional(readOnly = true)
    public List<VwAlrAll> getAlrByFuncaoTransacao(Long idFuncaoTransacao){
        List<VwAlrAll> vwAlrAlls = vwAlrAllSearchRepository.findByFuncaoId(idFuncaoTransacao);
        return vwAlrAlls;
    }
}
