package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.Manual;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Manual entity.
 */
public interface ManualSearchRepository extends ElasticsearchRepository<Manual, Long> {
}
