package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Perfil;
import br.com.basis.abaco.domain.User;
import br.com.basis.abaco.service.dto.DropdownDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

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

    Optional<Perfil> findByNome(String name);

    @Query("SELECT new br.com.basis.abaco.service.dto.DropdownDTO(e.id, e.nome) FROM Perfil e")
    List<DropdownDTO> getPerfilDropdown();
}
