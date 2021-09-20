package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Alr;
import br.com.basis.abaco.domain.Der;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the Alr entity.
 */
@SuppressWarnings("unused")
public interface AlrRepository extends JpaRepository<Alr, Long> {
    @Query(value = "SELECT a FROM Alr a  WHERE a.funcaoTransacao.id = :idFuncaoTransacao ORDER BY a.nome")
    List<Alr> getAlrByFuncaoTransacaoIdDropdown(@Param("idFuncaoTransacao") Long idFuncaoTransacao);
}
