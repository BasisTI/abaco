package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.Der;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data Elasticsearch repository for the Der entity.
 */
public interface DerSearchRepository extends ElasticsearchRepository<Der, Long> {

    Optional<List<String>> findDistinctByNomeContainingIgnoreCase(String nome);

    Optional<List<Der>> findByFuncaoDadosId(Long idFuncoes);


}
