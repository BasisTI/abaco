package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.BaseLineAnalitico;
import br.com.basis.abaco.domain.FuncaoDados;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;


/**
 * Spring Data JPA repository for the BaseLineAnalitico entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BaseLineAnaliticoRepository extends JpaRepository<BaseLineAnalitico, Long> {

    @Query( value = "SELECT * FROM baseline_analitico where id_sistema = ?1 AND tipo = 'ft'", nativeQuery = true)
    List<BaseLineAnalitico> getAllAnaliticosFT(Long id);

    @Query( value = "SELECT * FROM baseline_analitico where id_sistema = ?1 AND tipo = 'fd'", nativeQuery = true)
    List<BaseLineAnalitico> getAllAnaliticosFD(Long id);

}