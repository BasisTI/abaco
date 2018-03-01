package br.com.basis.abaco.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.basis.abaco.domain.FuncaoDados;
import br.com.basis.abaco.domain.FuncaoDadosVersionavel;

/**
 * Spring Data JPA repository for the FuncaoDados entity.
 */
public interface FuncaoDadosRepository extends JpaRepository<FuncaoDados, Long> {

    Optional<FuncaoDados> findFirstByFuncaoDadosVersionavelOrderByAuditUpdatedOnDesc(
            FuncaoDadosVersionavel funcaoDadosVersionavel);

    Optional<FuncaoDados> findFirstByFuncaoDadosVersionavelIdOrderByAuditUpdatedOnDesc(
            FuncaoDadosVersionavel funcaoDadosVersionavel);

    List<FuncaoDados> findByFuncaoDadosVersionavelIn(List<FuncaoDadosVersionavel> funcoesDadosVersionaveis);

}
