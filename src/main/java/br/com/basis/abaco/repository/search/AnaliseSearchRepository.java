package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.Analise;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.jpa.repository.EntityGraph;


public interface AnaliseSearchRepository extends ElasticsearchRepository<Analise, Long> {

    @EntityGraph(attributePaths = {"compartilhadas","funcaoDados","funcaoTransacaos","esforcoFases","users", "fatorAjuste", "contrato"})
    Analise findById(Long id);

}
