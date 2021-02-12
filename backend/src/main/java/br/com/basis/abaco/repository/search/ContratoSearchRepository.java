package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.Contrato;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Contrato entity.
 */
public interface ContratoSearchRepository extends ElasticsearchRepository<Contrato, Long> {
}
