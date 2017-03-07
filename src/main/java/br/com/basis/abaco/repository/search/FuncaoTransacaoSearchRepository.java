package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.FuncaoTransacao;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the FuncaoTransacao entity.
 */
public interface FuncaoTransacaoSearchRepository extends ElasticsearchRepository<FuncaoTransacao, Long> {
}
