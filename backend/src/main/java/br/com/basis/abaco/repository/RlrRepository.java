package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Der;
import br.com.basis.abaco.domain.Rlr;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the Rlr entity.
 */
@SuppressWarnings("unused")
public interface RlrRepository extends JpaRepository<Rlr, Long> {

    @Query(value = "SELECT r FROM Rlr r  WHERE r.funcaoDados.id = :idFuncaoDados ORDER BY r.nome")
    List<Rlr> getRlrByFuncaoDadosIdDropdown(@Param("idFuncaoDados") Long idFuncaoDados);

    List<Rlr> getRlrByFuncaoDadosId(Long idFuncaoDados);
}
