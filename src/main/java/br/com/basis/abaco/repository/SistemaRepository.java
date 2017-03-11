package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Sistema;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the Sistema entity.
 */
@SuppressWarnings("unused")
public interface SistemaRepository extends JpaRepository<Sistema,Long> {

	@Query(" SELECT s FROM Sistema s LEFT JOIN FETCH s.modulos WHERE s.id = :id")
	public Sistema findById(@Param("id") Long id);
}
