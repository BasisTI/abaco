package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.TipoEquipe;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface TipoEquipeSearchRepository extends ElasticsearchRepository<TipoEquipe, Long> {


}
