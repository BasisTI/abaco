package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Compartilhada;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the Compartilhada entity.
 */
@SuppressWarnings("unused")
public interface CompartilhadaRepository extends JpaRepository<Compartilhada,Long> {
    Optional<Compartilhada> findOneById(Long id);

    List<Compartilhada> findAllByAnaliseId(Long id);

}
