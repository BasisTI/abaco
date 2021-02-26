package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.novo.Fase;
import br.com.basis.abaco.service.dto.novo.DropdownDTO;
import br.com.basis.abaco.service.dto.FaseDTO;
import br.com.basis.abaco.service.dto.filter.FaseFiltroDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FaseRepository extends JpaRepository<Fase, Long> {

    Boolean existsByNome(String nome);

    Boolean existsByNomeAndIdNot(String nome, Long id);

    @Query("SELECT new br.com.basis.abaco.service.dto.FaseDTO(f.id, f.nome)" +
        " FROM Fase f WHERE (:#{#filtro.id} IS NULL OR  f.id = :#{#filtro.id})" +
        " AND ( :#{#filtro.nome} IS NULL OR LOWER(f.nome) LIKE " +
                    "LOWER( CAST(CONCAT('%', :#{#filtro.nome}, '%') AS text) )" +
            ")")
    Page<FaseDTO> findPage(@Param("filtro") FaseFiltroDTO filtro, Pageable page);

    Page<Fase> findByNomeContains(String nome, Pageable page);
    
    @Query("SELECT f " +
            " FROM Fase f WHERE (:#{#filtro.id} IS NULL OR  f.id = :#{#filtro.id})" +
            " AND ( :#{#filtro.nome} IS NULL OR LOWER(f.nome) LIKE " +
                        "LOWER( CAST(CONCAT('%', :#{#filtro.nome}, '%') AS text) )" +
                ")")
    Page<Fase> findByNomeContainsIlike(@Param("filtro") FaseFiltroDTO filtro, Pageable page);

    @Query("SELECT new br.com.basis.abaco.service.dto.novo.DropdownDTO(f.id, f.nome) FROM Fase f")
    List<DropdownDTO> getDropdown();
}
