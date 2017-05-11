package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Analise;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Analise entity.
 */
@SuppressWarnings("unused")
public interface AnaliseRepository extends JpaRepository<Analise,Long> {

}