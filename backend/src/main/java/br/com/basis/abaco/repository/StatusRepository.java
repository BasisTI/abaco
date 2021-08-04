package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.domain.Status;
import br.com.basis.abaco.service.dto.DropdownDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;


public interface StatusRepository extends JpaRepository<Status, Long> {

    Boolean existsByNome(String nome);

    Boolean existsByNomeAndIdNot(String nome, Long id);

    Page<Status> findByNomeContains(String nome, Pageable page);

    Optional<Status> findByNome(String nome);

    @Query("SELECT new br.com.basis.abaco.service.dto.DropdownDTO(s.id, s.nome) FROM Status s")
    List<DropdownDTO> getDropdown();

    Status findById(Long id);

    List<Status> findByAtivoTrue();

    Status findFirstByDivergenciaTrue();


}
