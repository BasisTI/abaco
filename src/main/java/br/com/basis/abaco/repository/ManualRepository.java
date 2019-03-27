package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Manual;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

/**
 * Spring Data JPA repository for the Manual entity.
 */
@SuppressWarnings("unused")
public interface ManualRepository extends JpaRepository<Manual, Long> {

    Optional<Manual> findOneByNome (String nome);

    @Query( value = "SELECT count(*) FROM CONTRATO WHERE manual_id = ?1", nativeQuery = true)
    Integer quantidadeContrato(Long id);

    @EntityGraph(attributePaths = {"esforcoFases","fatoresAjuste"})
    Manual findOne(Long id);

}
