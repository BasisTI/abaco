package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.FuncaoTransacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Set;

/**
 * Spring Data JPA repository for the FuncaoTransacao entity.
 */
@SuppressWarnings("unused")
public interface FuncaoTransacaoRepository extends JpaRepository<FuncaoTransacao, Long> {

    @Query(value = "SELECT funcionalidade_id FROM Funcao_Transacao where id = ?1", nativeQuery = true)
    Long getIdFuncionalidade(Long id);

    @Query("SELECT f FROM FuncaoTransacao f JOIN FETCH f.ders WHERE f.id = (:id)")
    FuncaoTransacao findWithDerAndAlr(@Param("id") Long id);

    @Query(value = "SELECT * FROM funcao_transacao WHERE funcionalidade_id = :id", nativeQuery = true)
    Set<FuncaoTransacao> findByFuncionalidade(@Param("id") Long id);
 }
