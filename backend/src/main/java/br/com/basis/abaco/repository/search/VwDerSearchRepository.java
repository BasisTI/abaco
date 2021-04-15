package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.VwDer;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

/**
 * Spring Data Elasticsearch repository for the VwDer entity.
 */
public interface VwDerSearchRepository extends ElasticsearchRepository<VwDer, Long> {

    List<VwDer> findAllByIdSistemaFD(Long idSistema);

    List<VwDer> findAllByIdSistemaFT(Long idSistema);
}
