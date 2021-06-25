package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.VwFuncaoDados;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface VwFuncaoDadosRepository extends JpaRepository<VwFuncaoDados, Long> {

    Set<VwFuncaoDados> findByAnaliseIdOrderById(Long analiseId);
}
