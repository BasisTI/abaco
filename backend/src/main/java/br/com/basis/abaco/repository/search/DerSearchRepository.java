package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.Der;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Der entity.
 */
public interface DerSearchRepository extends ElasticsearchRepository<Der, Long> {
}
