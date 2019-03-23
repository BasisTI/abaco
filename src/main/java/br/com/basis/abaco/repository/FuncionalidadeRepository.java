package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Funcionalidade;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * Spring Data JPA repository for the Funcionalidade entity.
 */
@SuppressWarnings("unused")
public interface FuncionalidadeRepository extends JpaRepository<Funcionalidade, Long> {

    @Query( value = "SELECT * FROM FUNCIONALIDADE WHERE modulo_id = ?1", nativeQuery = true)
    List<Funcionalidade> findByModulo (Long idModulo);

}
