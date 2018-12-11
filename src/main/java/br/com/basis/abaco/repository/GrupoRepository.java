package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Grupo;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.domain.Pageable;


/**
 * Spring Data  repository for the Grupo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GrupoRepository extends JpaRepository<Grupo, Long> {

    @Query(value = "SELECT a FROM Grupo a WHERE a.idAnalise IN :ids")
    Page<Grupo> findByIdAnalises(@Param("ids") List<Long> ids, Pageable pageable);


}
