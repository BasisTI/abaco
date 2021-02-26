package br.com.basis.abaco.service;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Optional;

import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.SearchQuery;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.basis.abaco.domain.Sistema;
import br.com.basis.abaco.repository.SistemaRepository;
import br.com.basis.abaco.repository.search.SistemaSearchRepository;
import br.com.basis.abaco.service.dto.SistemaDropdownDTO;
import br.com.basis.abaco.service.dto.SistemaListDTO;
import br.com.basis.abaco.service.dto.filter.SistemaFilterDTO;
import br.com.basis.abaco.service.exception.RelatorioException;
import br.com.basis.abaco.service.relatorio.RelatorioSistemaColunas;
import br.com.basis.abaco.utils.AbacoUtil;
import br.com.basis.dynamicexports.service.DynamicExportsService;
import net.sf.dynamicreports.report.exception.DRException;
import net.sf.jasperreports.engine.JRException;

@Service
@Transactional
public class SistemaService extends BaseService {

    private final SistemaRepository sistemaRepository;
    private final SistemaSearchRepository sistemaSearchRepository;
    private final DynamicExportsService dynamicExportsService;

    public SistemaService(SistemaRepository sistemaRepository, SistemaSearchRepository sistemaSearchRepository, DynamicExportsService dynamicExportsService) {
        this.sistemaRepository = sistemaRepository;
        this.sistemaSearchRepository = sistemaSearchRepository;
        this.dynamicExportsService = dynamicExportsService;
    }

    @Transactional(readOnly = true)
    public List<SistemaDropdownDTO> getSistemaDropdown() {
        return sistemaRepository.getSistemaDropdown();
    }

    public BoolQueryBuilder bindFilterSearch(String nome, String sigla, String numeroOcorrencia , Long [] organizacao) {
        BoolQueryBuilder qb = new BoolQueryBuilder();
        mustMatchWildcardContainsQueryLowerCase(nome, qb, "nomeSearch");
        mustMatchWildcardContainsQueryLowerCase(sigla, qb, "siglaSearch");
        mustMatchWildcardContainsQueryLowerCase(numeroOcorrencia, qb, "numeroOcorrenciaSearch");
        if(organizacao != null && organizacao.length > 0 ){
            BoolQueryBuilder boolQueryBuilderOrganizacao = QueryBuilders.boolQuery()
                .must(QueryBuilders.termsQuery("organizacao.id", organizacao));
            qb.must(boolQueryBuilderOrganizacao);
        }
        return qb;
    }

    public Sistema saveSistema( Sistema sistema) {
        Sistema result = sistemaRepository.save(sistema);
        sistemaSearchRepository.save(convertToEntity(convertToAnaliseEditDTO(result)));
        return result;
    }

    public Sistema convertToEntity(SistemaListDTO sistemaListDTO) {
        return new ModelMapper().map(sistemaListDTO, Sistema.class);
    }

    public SistemaListDTO convertToAnaliseEditDTO(Sistema sistema) {
        return new ModelMapper().map(sistema, SistemaListDTO.class);
    }


    public ByteArrayOutputStream gerarRelatorio(SistemaFilterDTO filtro, String tipoRelatorio) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream;
        try {
            Long[] organizacoes = null;
            if(filtro.getOrganizacao() != null && !filtro.getOrganizacao().isEmpty()) {
                organizacoes = new Long[filtro.getOrganizacao().size()];
            }
            BoolQueryBuilder qb = bindFilterSearch(filtro.getNome(), filtro.getSigla(), filtro.getNumeroOcorrencia(), organizacoes != null ? filtro.getOrganizacao().toArray(organizacoes) : null);
            SearchQuery searchQuery = new NativeSearchQueryBuilder().withQuery(qb).withPageable(dynamicExportsService.obterPageableMaximoExportacao()).build();
            Page<Sistema> page = sistemaSearchRepository.search(searchQuery);
  
            byteArrayOutputStream = dynamicExportsService.export(new RelatorioSistemaColunas(), page, tipoRelatorio, Optional.empty(), Optional.ofNullable(AbacoUtil.REPORT_LOGO_PATH), Optional.ofNullable(AbacoUtil.getReportFooter()));
        } catch (DRException | ClassNotFoundException | JRException | NoClassDefFoundError e) {
            throw new RelatorioException(e);
        }
        return byteArrayOutputStream;
    }

    public List<Sistema> getAll() {
        return sistemaRepository.findAll();
    }

}
