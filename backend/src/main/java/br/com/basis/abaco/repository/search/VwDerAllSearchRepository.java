package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.VwAlrAll;
import br.com.basis.abaco.domain.VwDer;
import br.com.basis.abaco.domain.VwDerAll;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

/**
 * Spring Data Elasticsearch repository for the VwDer entity.
 */
public interface VwDerAllSearchRepository extends ElasticsearchRepository<VwDerAll, Long> {

    List<VwDerAll> findByFuncaoId(Long funcaoId);
}
