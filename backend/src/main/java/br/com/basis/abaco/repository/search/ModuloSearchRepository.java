package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.Modulo;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Modulo entity.
 */
public interface ModuloSearchRepository extends ElasticsearchRepository<Modulo, Long> {
}
