package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.BaseLineAnalitico;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;
import java.util.Set;

public interface BaseLineAnaliticoSearchRepository extends ElasticsearchRepository<BaseLineAnalitico, Long> {

    List<BaseLineAnalitico> findByIdsistemaAndTipoOrderByNameAsc(Long idsistema, String tipo);
    List<BaseLineAnalitico> getAllByIdsistemaAndEquipeResponsavelIdAndTipo(Long Idsistema, Long idEquipe, String tipo);
    Set<BaseLineAnalitico> findAll();

}
