package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.Fase;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Fase entity.
 */
public interface FaseSearchRepository extends ElasticsearchRepository<Fase, Long> {
}
