package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.Analise;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.query.SearchQuery;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;


public interface AnaliseSearchRepository extends ElasticsearchRepository<Analise, Long> {

    Page<Analise> findAnaliseByUsers(SearchQuery query, Pageable pageable);

}
