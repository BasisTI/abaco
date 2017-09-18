package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.FatorAjuste;
import br.com.basis.abaco.domain.Manual;
import br.com.basis.abaco.domain.enumeration.TipoFatorAjuste;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Spring Data JPA repository for the FatorAjuste entity.
 */
@SuppressWarnings("unused")
public interface FatorAjusteRepository extends JpaRepository<FatorAjuste, Long> {

    /**
     * Get list of factore adjustments by manual and type
     *
     * @param manual
     * @param tipoAjuste
     * @return
     */
    List<FatorAjuste> findAllByManualAndTipoAjuste(Manual manual, TipoFatorAjuste tipoAjuste);

}
