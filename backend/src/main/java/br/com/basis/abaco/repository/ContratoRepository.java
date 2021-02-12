package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Contrato;
import br.com.basis.abaco.domain.Organizacao;
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
     * @param organizacao
     */
    List<Contrato> findAllByOrganization(Organizacao organizacao);

    @EntityGraph(attributePaths = {"manualContrato"})
    Contrato findOne(Long id);

}
