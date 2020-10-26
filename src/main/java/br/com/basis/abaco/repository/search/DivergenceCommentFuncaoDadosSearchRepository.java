package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.DivergenceCommentFuncaoDados;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface DivergenceCommentFuncaoDadosSearchRepository extends ElasticsearchRepository<DivergenceCommentFuncaoDados, Long> {

}
