package br.com.basis.abaco.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.basis.abaco.domain.Der;
import br.com.basis.abaco.service.dto.DropdownDTO;

/**
 * Spring Data JPA repository for the Der entity.
 */
public interface DerRepository extends JpaRepository<Der, Long> {

    @Query(value = "SELECT d FROM Der d  WHERE d.funcaoDados.id = :idFuncaoDados ORDER BY d.nome")
    List<Der> getDerByFuncaoDadosIdDropdown(@Param("idFuncaoDados") Long idFuncaoDados);

    @Query(value = "SELECT d FROM Der d  WHERE d.funcaoTransacao.id = :idFuncaoTransacao ORDER BY d.nome")
    List<Der> getDerByFuncaoTransacaoIdDropdown(@Param("idFuncaoTransacao") Long idFuncaoTransacao);

    List<Der> getDerByFuncaoDadosId(Long idFuncaoDados);
    List<Der> getDerByFuncaoTransacaoId(Long idFuncaoTransacao);

    @Query(value = "SELECT distinct d.nome FROM Der d " +
        "WHERE d.funcaoTransacao.funcionalidade.modulo.sistema.id = :idSistema")
    List<String> getDerBySistemaAndFuncaoTransacao(@Param("idSistema") Long idSistema);

    @Query(value = "SELECT distinct d.nome FROM Der d " +
        "WHERE d.funcaoDados.funcionalidade.modulo.sistema.id = :idSistema")
    List<String> getDerBySistemaAndFuncaoDados(@Param("idSistema") Long idSistema);
}
