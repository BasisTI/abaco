package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.VwDer;
import br.com.basis.abaco.domain.VwRlr;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

/**
 * Spring Data Elasticsearch repository for the VwRlr entity.
 */
public interface VwRlrSearchRepository extends ElasticsearchRepository<VwRlr, Long> {

    List<VwRlr> findAllByIdSistema(Long idSistema);
}
