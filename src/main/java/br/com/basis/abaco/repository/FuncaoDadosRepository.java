package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.FuncaoDados;
import br.com.basis.abaco.service.dto.DropdownDTO;
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


    Optional<FuncaoDados> findFirstByFuncaoDadosVersionavelIdOrderByAuditUpdatedOnDesc(
            Long funcaoDadosVersionavelId);

    @Query(value = "SELECT f FROM FuncaoDados f WHERE f.analise.id = ?1 AND f.name = ?2")
    FuncaoDados findName(Long idAnalise, String name);

    @Query(value = "SELECT f FROM FuncaoDados f WHERE f.analise.id = ?1 ")
    List<FuncaoDados> findByAnalise(Long id);

    @Query(value = "SELECT f FROM FuncaoDados f WHERE f.id = ?1")
    FuncaoDados findById(Long id);

    @Query(value = "SELECT f.funcionalidade.id FROM FuncaoDados f where f.id = ?1")
    Long getIdFuncionalidade(Long id);

    @Query(value = "SELECT f FROM FuncaoDados f WHERE f.analise.id = :analiseId AND f.funcionalidade.id = :funcionalidadeId ORDER BY f.name asc, f.id asc")
    Set<FuncaoDados> findByAnaliseFuncionalidade(@Param("analiseId") Long analiseId, @Param("funcionalidadeId") Long funcionalidadeId);

    @Query(value = "SELECT new br.com.basis.abaco.service.dto.DropdownDTO(f.id, f.name) FROM Analise a JOIN a.funcaoDados f"
            + " WHERE a.enviarBaseline = true AND a.bloqueiaAnalise = true")
    List<DropdownDTO> getFuncaoDadosDropdown();

    @Query("SELECT fb FROM FuncaoDados fb JOIN fb.funcionalidade fun JOIN fun.modulo m WHERE fb.analise.id = ?1")
    List<FuncaoDados> findByAnalise_Id(Long idAnalise);
}
