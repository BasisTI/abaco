package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.Sistema;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Sistema entity.
 */
public interface SistemaSearchRepository extends ElasticsearchRepository<Sistema, Long> {
}
