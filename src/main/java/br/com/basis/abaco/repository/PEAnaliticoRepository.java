package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.PEAnalitico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;


/**
 * Spring Data JPA repository for the BaseLineAnalitico entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PEAnaliticoRepository extends JpaRepository<PEAnalitico, Long> {

    Set<PEAnalitico> findAllByidsistema(Long idsistema);
}
