package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.BaseLineAnaliticoFT;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;
import java.util.Set;

public interface BaseLineAnaliticoFTSearchRepository extends ElasticsearchRepository<BaseLineAnaliticoFT, Long> {

    List<BaseLineAnaliticoFT> findByIdsistemaOrderByNameAsc(Long idsistema);

    Set<BaseLineAnaliticoFT> findAll();

    List<BaseLineAnaliticoFT> getAllByIdsistemaAndEquipeResponsavelId(Long id, Long idEquipe);

    void  deleteAllByIdsistemaAndEquipeResponsavelId(Long id, Long idEquipe);

}
