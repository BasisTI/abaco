package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.Status;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface StatusSearchRepository extends ElasticsearchRepository<Status, Long> {


}
