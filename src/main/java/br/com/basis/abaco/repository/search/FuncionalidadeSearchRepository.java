package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.Funcionalidade;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Funcionalidade entity.
 */
public interface FuncionalidadeSearchRepository extends ElasticsearchRepository<Funcionalidade, Long> {
}
