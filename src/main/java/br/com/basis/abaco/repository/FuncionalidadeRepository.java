package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Funcionalidade;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Funcionalidade entity.
 */
@SuppressWarnings("unused")
public interface FuncionalidadeRepository extends JpaRepository<Funcionalidade,Long> {

}
