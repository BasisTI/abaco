package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.FuncaoDados;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the FuncaoDados entity.
 */
@SuppressWarnings("unused")
public interface FuncaoDadosRepository extends JpaRepository<FuncaoDados,Long> {

}
