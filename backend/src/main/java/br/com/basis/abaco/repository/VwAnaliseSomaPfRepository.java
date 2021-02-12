package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.VwAnaliseSomaPf;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VwAnaliseSomaPfRepository extends JpaRepository<VwAnaliseSomaPf, Long> {

    VwAnaliseSomaPf findByAnaliseId(Long analiseId);

}
