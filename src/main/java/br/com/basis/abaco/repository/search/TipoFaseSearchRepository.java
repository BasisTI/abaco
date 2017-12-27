package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.TipoFase;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the TipoFase entity.
 */
public interface TipoFaseSearchRepository extends ElasticsearchRepository<TipoFase, Long> {
}
