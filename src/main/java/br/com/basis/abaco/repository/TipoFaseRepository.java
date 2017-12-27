package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.TipoFase;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the TipoFase entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TipoFaseRepository extends JpaRepository<TipoFase, Long> {

}
