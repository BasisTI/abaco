package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Sistema;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Sistema entity.
 */
@SuppressWarnings("unused")
public interface SistemaRepository extends JpaRepository<Sistema,Long> {

}
