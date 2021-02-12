package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.DivergenceCommentFuncaoTransacao;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface DivergenceCommentFuncaoTransacaoSearchRepository extends ElasticsearchRepository<DivergenceCommentFuncaoTransacao, Long> {

}
