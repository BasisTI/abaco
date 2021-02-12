package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.Analise;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface AnaliseSearchRepository extends ElasticsearchRepository<Analise, Long> {



    Boolean existsByStatusId(Long id);
//    Page<Analise> findAllByAnaliseDivergenceIsTrue(Pageable pageable);

}
