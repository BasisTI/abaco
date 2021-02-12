package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.Rlr;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Rlr entity.
 */
public interface RlrSearchRepository extends ElasticsearchRepository<Rlr, Long> {
}
