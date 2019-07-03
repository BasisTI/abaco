package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Manual;
import br.com.basis.abaco.service.dto.DropdownDTO;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the Manual entity.
 */
@SuppressWarnings("unused")
public interface ManualRepository extends JpaRepository<Manual, Long> {

    Optional<Manual> findOneByNome (String nome);

    @EntityGraph(attributePaths = {"esforcoFases","fatoresAjuste"})
    Manual findOne(Long id);

    @Query("SELECT new br.com.basis.abaco.service.dto.DropdownDTO(m.id, m.nome) FROM Manual m")
    List<DropdownDTO> getManualdropdow();
}
