package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.VwAnaliseDivergenteSomaPf;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VwAnaliseDivergenteSomaPfRepository extends JpaRepository<VwAnaliseDivergenteSomaPf, Long> {

    VwAnaliseDivergenteSomaPf findByAnaliseId(Long analiseId);

}
