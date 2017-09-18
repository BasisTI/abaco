package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Manual;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the Manual entity.
 */
@SuppressWarnings("unused")
public interface ManualRepository extends JpaRepository<Manual, Long> {

}
