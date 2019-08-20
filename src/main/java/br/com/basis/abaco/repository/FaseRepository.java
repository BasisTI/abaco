package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.novo.Fase;
import br.com.basis.abaco.service.dto.FaseDTO;
import br.com.basis.abaco.service.dto.filtro.FaseFiltroDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FaseRepository extends JpaRepository<Fase, Long>, JpaSpecificationExecutor<Fase> {

    Boolean existsByNome(String nome);

    @Query("SELECT new br.com.basis.abaco.service.dto.FaseDTO(f.id, f.nome)" +
        " FROM Fase f WHERE (:#{#filtro.id} IS NULL OR  f.id = :#{#filtro.id})" +
        " AND ( :#{#filtro.nome} IS NULL OR LOWER(f.nome) LIKE " +
                    "LOWER( CAST(CONCAT('%', :#{#filtro.nome}, '%') AS text) )" +
            ")")
    Page<FaseDTO> findFilter(@Param("filtro") FaseFiltroDTO filtro, Pageable page);
}
