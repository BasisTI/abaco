package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.EsforcoFase;
import br.com.basis.abaco.domain.Manual;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Spring Data JPA repository for the EsforcoFase entity.
 */
@SuppressWarnings("unused")
public interface EsforcoFaseRepository extends JpaRepository<EsforcoFase, Long> {

    public List<EsforcoFase> findAllByManual(Manual manual);
}
