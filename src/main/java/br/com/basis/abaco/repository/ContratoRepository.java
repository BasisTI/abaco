package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Contrato;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * Spring Data JPA repository for the Contrato entity.
 */
@SuppressWarnings("unused")
public interface ContratoRepository extends JpaRepository<Contrato, Long> {

    /**
     * Get list of contracts by organization
     *
     * @return
     */
    @Query(value = "SELECT * FROM contrato c WHERE c.organization_id = ?1", nativeQuery = true)
    List<Contrato> findAllByOrganization(Long id);

    @EntityGraph(attributePaths = {"manualContrato"})
    Contrato findOne(Long id);

}
