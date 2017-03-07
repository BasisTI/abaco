package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Contrato;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Contrato entity.
 */
@SuppressWarnings("unused")
public interface ContratoRepository extends JpaRepository<Contrato,Long> {

}
