package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.BaseLineSintetico;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface BaseLineSinteticoSearchRepository extends ElasticsearchRepository<BaseLineSintetico, Long> {

    List<BaseLineSintetico> findAllByIdsistema(Long idsistema);

    Iterable<BaseLineSintetico> findAll();

    BaseLineSintetico findOneByIdsistema(Long idsistema);

    BaseLineSintetico findOneByIdsistemaAndEquipeResponsavelId(Long idsistema, Long idEquipe);

}
