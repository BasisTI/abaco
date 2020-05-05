package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.VwResumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface VwResumoRepository extends JpaRepository<VwResumo, Long> {

    Set<VwResumo> findByAnaliseIdOrderByTipoAsc(Long analiseId);

}
