package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.EsforcoFase;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the EsforcoFase entity.
 */
public interface EsforcoFaseSearchRepository extends ElasticsearchRepository<EsforcoFase, Long> {
}
