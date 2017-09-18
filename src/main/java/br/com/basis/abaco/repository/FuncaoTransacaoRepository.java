package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.FuncaoTransacao;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the FuncaoTransacao entity.
 */
@SuppressWarnings("unused")
public interface FuncaoTransacaoRepository extends JpaRepository<FuncaoTransacao, Long> {

}
