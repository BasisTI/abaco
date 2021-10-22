package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.VwAlrAll;
import br.com.basis.abaco.domain.VwRlr;
import br.com.basis.abaco.domain.VwRlrAll;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

/**
 * Spring Data Elasticsearch repository for the VwRlr entity.
 */
public interface VwRlrAllSearchRepository extends ElasticsearchRepository<VwRlrAll, Long> {

    List<VwRlrAll> findByFuncaoId(Long funcaoId);
}
