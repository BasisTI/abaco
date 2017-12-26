package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.TipoEquipe;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the TipoEquipe entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TipoEquipeRepository extends JpaRepository<TipoEquipe, Long> {

}
