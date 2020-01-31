package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.FuncaoTransacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    List<FuncaoTransacao> findAllByAnalise_Id(Long id);
}
