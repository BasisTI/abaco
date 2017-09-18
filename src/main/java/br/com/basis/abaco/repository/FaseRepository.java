package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Fase;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the Fase entity.
 */
@SuppressWarnings("unused")
public interface FaseRepository extends JpaRepository<Fase, Long> {

}
