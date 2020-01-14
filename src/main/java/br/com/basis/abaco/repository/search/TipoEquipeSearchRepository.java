package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.TipoEquipe;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.Set;

public interface TipoEquipeSearchRepository extends ElasticsearchRepository<TipoEquipe, Long> {

    Set<TipoEquipe> findByUsuarios_Login(String login);

}
