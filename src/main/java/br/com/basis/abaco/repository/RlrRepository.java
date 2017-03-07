package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Rlr;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Rlr entity.
 */
@SuppressWarnings("unused")
public interface RlrRepository extends JpaRepository<Rlr,Long> {

}
