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

}
