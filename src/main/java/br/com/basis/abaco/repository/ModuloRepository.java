package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Modulo;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the Modulo entity.
 */
@SuppressWarnings("unused")
public interface ModuloRepository extends JpaRepository<Modulo, Long> {

}
