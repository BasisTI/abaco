package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Perfil;
import br.com.basis.abaco.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Perfil entity.
 */
@Repository
public interface PerfilRepository extends JpaRepository<Perfil, Long> {

    Optional<Perfil> findById(Long id);

    Optional<List<Perfil>> findAllByUsers(User user);

    List<Perfil> findAllByFlgAtivoIsTrue();
}
