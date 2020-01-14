package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.User;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface UserSearchRepository extends ElasticsearchRepository<User, Long> {

    User findByLogin(String login);

    List<User> getAllByFirstNameIsNotNull();
}
