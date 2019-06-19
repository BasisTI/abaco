package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.FuncaoDados;
import br.com.basis.abaco.domain.FuncaoDadosVersionavel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Spring Data JPA repository for the FuncaoDados entity.
 */
public interface FuncaoDadosRepository extends JpaRepository<FuncaoDados, Long> {

    Optional<FuncaoDados> findFirstByFuncaoDadosVersionavelOrderByAuditUpdatedOnDesc(
            FuncaoDadosVersionavel funcaoDadosVersionavel);

    Optional<FuncaoDados> findFirstByFuncaoDadosVersionavelIdOrderByAuditUpdatedOnDesc(
            Long funcaoDadosVersionavelId);

    List<FuncaoDados> findByFuncaoDadosVersionavelIn(List<FuncaoDadosVersionavel> funcoesDadosVersionaveis);

    @Query( value = "SELECT f FROM FuncaoDados f WHERE f.analise.id = ?1 AND f.name = ?2")
    FuncaoDados findName(Long idAnalise, String name);

    @Query( value = "SELECT f FROM FuncaoDados f WHERE f.analise.id = ?1")
    List<FuncaoDados> findByAnalise(Long id);

    @Query( value = "SELECT f FROM FuncaoDados f WHERE f.id = ?1")
    FuncaoDados findById(Long id);

    @Query(value = "SELECT f.funcionalidade.id FROM FuncaoDados f where f.id = ?1")
    Long getIdFuncionalidade(Long id);

    @Query(value = "SELECT f FROM FuncaoDados f WHERE f.funcionalidade = :id")
    Set<FuncaoDados> findByFuncionalidade(@Param("id") Long id);

    @Query( value = "SELECT f FROM FuncaoDados f WHERE f.analise.id = :analiseId AND f.funcionalidade.id = :funcionalidadeId ORDER BY f.name asc, f.id asc")
    Set<FuncaoDados> findByAnaliseFuncionalidade(@Param("analiseId")Long analiseId,@Param("funcionalidadeId") Long funcionalidadeId);
}
