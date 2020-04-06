package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.FuncaoTransacao;
import br.com.basis.abaco.domain.enumeration.Complexidade;
import br.com.basis.abaco.domain.enumeration.ImpactoFatorAjuste;
import br.com.basis.abaco.domain.enumeration.TipoFuncaoTransacao;
import br.com.basis.abaco.service.dto.FatorAjusteDTO;
import br.com.basis.abaco.service.dto.FuncionalidadeDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

/**
 * Spring Data JPA repository for the FuncaoTransacao entity.
 */
@SuppressWarnings("unused")
public interface FuncaoTransacaoRepository extends JpaRepository<FuncaoTransacao, Long> {

    @Query(value = "SELECT f.funcionalidade.id FROM FuncaoTransacao f where f.id = ?1")
    Long getIdFuncionalidade(Long id);

    @Query("SELECT f FROM FuncaoTransacao f JOIN FETCH f.ders WHERE f.id = (:id)")
    FuncaoTransacao findWithDerAndAlr(@Param("id") Long id);

    @Query(value = "SELECT f FROM FuncaoTransacao f WHERE f.funcionalidade.id = :id")
    Set<FuncaoTransacao> findByFuncionalidade(@Param("id") Long id);

    @Query(value = "SELECT f FROM FuncaoTransacao f WHERE f.analise.id = :analiseId AND f.funcionalidade.id = :funcionalidadeId ORDER BY f.name asc, f.id asc")
    Set<FuncaoTransacao> findByAnaliseFuncionalidade(@Param("analiseId") Long analiseId, @Param("funcionalidadeId") Long funcionalidadeId);

    @Query("SELECT ft FROM FuncaoTransacao ft JOIN ft.funcionalidade fun JOIN fun.modulo m WHERE ft.analise.id = ?1")
    Set<FuncaoTransacao> findAllByAnalise_Id(Long id);

    Boolean existsByNameAndAnalise_IdAndFuncionalidade_IdAndFuncionalidade_Modulo_Id(String name, Long analiseId, Long idFuncionalidade, Long idModulo);

    Boolean existsByNameAndAnalise_IdAndFuncionalidade_IdAndFuncionalidade_Modulo_IdAndIdNot(String name, Long analiseId, Long idFuncionalidade, Long idModulo, Long id);

    @Query("SELECT ft.id, ft.name, ft.fatorAjuste, ft.funcionalidade, ft.tipo, ft.ders, ft.alrs,ft.complexidade, ft.pf, ft.grossPF, ft.sustantation,ft.impacto FROM FuncaoTransacao ft JOIN ft.funcionalidade fun JOIN fun.modulo m WHERE ft.analise.id = ?1")
    Set<FuncaoTransacao> findAllByAnaliseId(Long id);
}
