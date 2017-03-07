package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.FuncaoDados;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the FuncaoDados entity.
 */
public interface FuncaoDadosSearchRepository extends ElasticsearchRepository<FuncaoDados, Long> {
}
