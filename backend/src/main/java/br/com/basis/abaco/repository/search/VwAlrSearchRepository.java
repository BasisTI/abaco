package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.VwAlr;
import br.com.basis.abaco.domain.VwRlr;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

/**
 * Spring Data Elasticsearch repository for the VwAlr entity.
 */
public interface VwAlrSearchRepository extends ElasticsearchRepository<VwAlr, Long> {
    List<VwAlr> findAllByIdSistema(Long idSistema);
}
