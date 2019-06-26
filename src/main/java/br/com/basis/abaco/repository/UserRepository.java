package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.TipoEquipe;
import br.com.basis.abaco.domain.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigInteger;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Spring Data JPA repository for the User entity.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findOneByActivationKey(String activationKey);

    List<User> findAllByActivatedIsFalseAndCreatedDateBefore(ZonedDateTime dateTime);

    Optional<User> findOneByResetKey(String resetKey);

    Optional<User> findOneByEmail(String email);

    Optional<User> findOneByLogin(String login);

    Optional<User> findOneById(Long id);

    Optional<User> findOneByFirstNameAndLastName(String firstName, String lastName);

    @EntityGraph(attributePaths = {"authorities","tipoEquipes","organizacoes"})
    User findOneWithAuthoritiesById(Long id);

    @EntityGraph(attributePaths = {"authorities","tipoEquipes","organizacoes"})
    Optional<User> findOneWithAuthoritiesByLogin(String login);

    @Query(value = "SELECT u.tipoEquipes FROM User u WHERE u.login = :login")
    List<TipoEquipe> findAllEquipesByLogin(@Param("login") String login);
    
    @Query(value = "SELECT" +
        " * FROM jhi_user u" +
        " JOIN user_organizacao o ON u.id = o.user_id" +
        " JOIN user_tipo_equipe e ON u.id = e.user_id" +
        " WHERE e.tipo_equipe_id = :idEquip AND o.organizacao_id = :idOrg", nativeQuery = true)
    List<User> findAllUsersOrgEquip(@Param("idOrg") Long idOrg, @Param("idEquip") Long idEquip);

    Page<User> findAllByLoginNot(Pageable pageable, String login);

    @Query(value = "select tipo_equipe_id from user_tipo_equipe where user_id = :idUser", nativeQuery = true)
    List<BigInteger> findUserEquipes(@Param("idUser") Long idUser);

    @EntityGraph(attributePaths = {"authorities","tipoEquipes","organizacoes"})
    @Query(value = "select u from User u join fetch u.organizacoes o where u.login=?1 and u.activated=true and o.ativo=true")
    User findUserWithActiveOrgs(String login);

    @Query(value = "SELECT a.users FROM Analise a WHERE a.id = :id  ")
    Set<User> findAllByAnalise(@Param("id") Long analiseId);
}
