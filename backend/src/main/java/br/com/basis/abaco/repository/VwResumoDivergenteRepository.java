package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.VwResumoDivergencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface VwResumoDivergenteRepository extends JpaRepository<VwResumoDivergencia, Long> {

    Set<VwResumoDivergencia> findByAnaliseIdOrderByTipoAsc(Long analiseId);

}
