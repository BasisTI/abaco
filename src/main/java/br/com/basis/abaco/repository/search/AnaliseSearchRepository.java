package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.Analise;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Analise entity.
 */
public interface AnaliseSearchRepository extends ElasticsearchRepository<Analise, Long> {
}
