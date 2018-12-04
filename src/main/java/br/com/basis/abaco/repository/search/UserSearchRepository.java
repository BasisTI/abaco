package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.User;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * Spring Data Elasticsearch repository for the User entity.
 */
public interface UserSearchRepository extends ElasticsearchRepository<User, Long> {

    // Query para encontrar os id's das equipes do usuário
    @Query (value = "{" +
                    "   \"sort\": [" +
                    "       {\"id\": \"asc\"}" +
                    "      ]," +
                    "   \"_source\": [\"tipoEquipes.id\"]," +
                    "   \"filter\": {" +
                    "       \"match\": {\"id\": ?1}" +
                    "   }" +
                    "}", nativeQuery = true)
    List<Long> findTipoEquipesById(Long idUser);
}
