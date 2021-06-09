package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.PerfilOrganizacao;
import br.com.basis.abaco.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the PerfilOrganizacao entity.
 */
@Repository
public interface PerfilOrganizacaoRepository extends JpaRepository<PerfilOrganizacao, Long> {

    Optional<List<PerfilOrganizacao>> findAllByUser(User user);
}
