package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.repository.document.FaseDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface FaseSearchRepository extends ElasticsearchRepository<FaseDocument, Long> {
}
