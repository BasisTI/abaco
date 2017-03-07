package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.FatorAjuste;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the FatorAjuste entity.
 */
public interface FatorAjusteSearchRepository extends ElasticsearchRepository<FatorAjuste, Long> {
}
