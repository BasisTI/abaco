package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.FatorAjuste;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the FatorAjuste entity.
 */
@SuppressWarnings("unused")
public interface FatorAjusteRepository extends JpaRepository<FatorAjuste,Long> {

}
