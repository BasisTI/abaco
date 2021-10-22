package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.VwAlr;
import br.com.basis.abaco.domain.VwAlrAll;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

/**
 * Spring Data Elasticsearch repository for the VwAlr entity.
 */
public interface VwAlrAllSearchRepository extends ElasticsearchRepository<VwAlrAll, Long> {

    List<VwAlrAll> findByFuncaoId(Long funcaoId);

}
