package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Contrato;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

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
    List<Contrato> findAllByOrganization(Long id);

    @EntityGraph(attributePaths = {"manualContrato"})
    Contrato findOne(Long id);

}
