package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.TipoEquipe;
import org.elasticsearch.index.query.QueryBuilder;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * Spring Data Elasticsearch repository for the TipoEquipe entity.
 */
public interface TipoEquipeSearchRepository extends ElasticsearchRepository<TipoEquipe, Long> {

    @Query(value = "{" +
                    "   \"sort\": [" +
                    "       {\"id\": \"asc\"}" +
                    "   ]," +
                    "   \"_source\": [\"organizacoes.id\"]," +
                    "   \"filter\": {" +
                    "       \"ids\": {" +
                    "           \"values\": [?1]" +
                    "       }" +
                    "   }" +
                    "}")
    List<Long> findAllOrganizacaoIdById(List<Long> idEquipes);
}
