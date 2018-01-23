package br.com.basis.abaco.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.basis.abaco.domain.EsforcoFase;
import br.com.basis.abaco.domain.Manual;

/**
 * Spring Data JPA repository for the EsforcoFase entity.
 */
@SuppressWarnings("unused")
public interface EsforcoFaseRepository extends JpaRepository<EsforcoFase, Long> {

	public List<EsforcoFase> findAllByManual(Manual manual);
}
