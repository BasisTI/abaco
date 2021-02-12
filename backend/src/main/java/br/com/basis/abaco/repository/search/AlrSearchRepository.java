package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.Alr;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Alr entity.
 */
public interface AlrSearchRepository extends ElasticsearchRepository<Alr, Long> {
}
