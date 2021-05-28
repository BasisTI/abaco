package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.VwFuncaoTransacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface VwFuncaoTransacaoRepository extends JpaRepository<VwFuncaoTransacao, Long> {

    Set<VwFuncaoTransacao> findByAnaliseIdOrderById(Long analiseId);
}
