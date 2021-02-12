package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.ManualContrato;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface ManualContratoSearchRepository extends ElasticsearchRepository<ManualContrato, Long> {
}
