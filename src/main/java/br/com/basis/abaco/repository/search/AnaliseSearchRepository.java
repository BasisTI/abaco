package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.Analise;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;


public interface AnaliseSearchRepository extends ElasticsearchRepository<Analise, Long> {

    Boolean existsByStatusId(Long id);

}
