package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.Nomenclatura;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface NomenclaturaSearchRepository extends ElasticsearchRepository<Nomenclatura, Long> {

}
