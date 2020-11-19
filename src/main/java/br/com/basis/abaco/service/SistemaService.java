package br.com.basis.abaco.service;

import br.com.basis.abaco.domain.Sistema;
import br.com.basis.abaco.repository.SistemaRepository;
import br.com.basis.abaco.repository.search.SistemaSearchRepository;
import br.com.basis.abaco.service.dto.SistemaDropdownDTO;
import br.com.basis.abaco.service.dto.SistemaListDTO;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SistemaService extends BaseService {

    private final SistemaRepository sistemaRepository;
    private final SistemaSearchRepository sistemaSearchRepository;

    public SistemaService(SistemaRepository sistemaRepository, SistemaSearchRepository sistemaSearchRepository) {
        this.sistemaRepository = sistemaRepository;
        this.sistemaSearchRepository = sistemaSearchRepository;
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

}
