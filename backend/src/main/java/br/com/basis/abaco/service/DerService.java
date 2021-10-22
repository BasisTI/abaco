package br.com.basis.abaco.service;

import br.com.basis.abaco.domain.Der;
import br.com.basis.abaco.domain.VwDer;
import br.com.basis.abaco.domain.VwDerAll;
import br.com.basis.abaco.repository.DerRepository;
import br.com.basis.abaco.repository.search.VwDerAllSearchRepository;
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
public class DerService {

    private final DerRepository derRepository;
    private final ElasticsearchTemplate elasticsearchTemplate;
    private final DynamicExportsService dynamicExportsService;

    private final VwDerAllSearchRepository vwDerAllSearchRepository;

    public DerService(DerRepository derRepository, ElasticsearchTemplate elasticsearchTemplate, DynamicExportsService dynamicExportsService, VwDerAllSearchRepository vwDerAllSearchRepository) {
        this.derRepository = derRepository;
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.dynamicExportsService = dynamicExportsService;
        this.vwDerAllSearchRepository = vwDerAllSearchRepository;
    }

    @Transactional(readOnly = true)
    public List<DropdownDTO> getDerByFuncaoDadosIdDropdown(Long idFuncaoDados) {
       List<DropdownDTO> lstDersDrop = new ArrayList<>();
        List<Der> lstDersFD = derRepository.getDerByFuncaoDadosIdDropdown(idFuncaoDados);
        lstDersFD.forEach(der -> {
            DropdownDTO dropdownDerFD;
            if(der.getNome() == null || der.getNome().isEmpty()){
                dropdownDerFD = new br.com.basis.abaco.service.dto.DropdownDTO(der.getId(),der.getValor().toString());
            }else {
                dropdownDerFD = new br.com.basis.abaco.service.dto.DropdownDTO(der.getId(),der.getNome());
            }
            lstDersDrop.add(dropdownDerFD);
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

    @Transactional(readOnly = true)
    public List<VwDerAll> getDerByFuncao(Long idFuncaoDados){
        return vwDerAllSearchRepository.findByFuncaoId(idFuncaoDados);
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
