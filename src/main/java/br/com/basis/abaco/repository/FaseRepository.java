package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.novo.Fase;
import br.com.basis.abaco.service.dto.FaseDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * Spring Data JPA repository for the Fase entity.
 */
@SuppressWarnings("unused")
public interface FaseRepository extends JpaRepository<Fase, Long> {

    @Query("SELECT new br.com.basis.abaco.service.dto.FaseDTO(f.id, f.nome) FROM Fase f")
    List<FaseDTO> getFasesDTO();

    Boolean existsByNome(String nome);
}
