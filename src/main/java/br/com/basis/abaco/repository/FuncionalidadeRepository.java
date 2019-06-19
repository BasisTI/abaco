package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Funcionalidade;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the Funcionalidade entity.
 */
@SuppressWarnings("unused")
public interface FuncionalidadeRepository extends JpaRepository<Funcionalidade, Long> {

    List<Funcionalidade> findByModulo (Long idModulo);

}
