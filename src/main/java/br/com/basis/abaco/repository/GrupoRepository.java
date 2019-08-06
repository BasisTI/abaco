package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Grupo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Spring Data  repository for the Grupo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GrupoRepository extends JpaRepository<Grupo, Long> {


    @Query("SELECT DISTINCT g FROM Grupo g " +
        "INNER JOIN Analise a ON a.id = g.idAnalise " +
        "INNER JOIN a.users u " +
        "WHERE " +
        "( :identificador IS NULL OR ( :identificador IS NOT NULL AND UPPER(g.identificadorAnalise) like concat('%', UPPER( :identificador), '%'))) AND " +
        "( :sistema IS NULL OR ( :sistema IS NOT NULL AND g.sistema = :sistema)) AND " +
        "( :metodo IS NULL OR ( :metodo IS NOT NULL AND g.metodoContagem = :metodo)) AND " +
        "( :organizacao IS NULL OR ( :organizacao IS NOT NULL AND g.organizacao = :organizacao)) AND " +
        "( :equipe IS NULL OR ( :equipe IS NOT NULL AND g.equipe = :equipe)) AND " +
        "( :usuario IS NULL OR ( :usuario IS NOT NULL AND " +
        "( :usuario LIKE UPPER(concat('%', u.firstName, '%', u.lastName, '%')) OR " +
            "(:usuario LIKE UPPER(concat('%', u.firstName, '%'))) OR " +
            "(:usuario LIKE UPPER(concat('%', u.lastName, '%'))) )" +
        " )) AND  " +
        "( g.idAnalise in :ids)")
    Page<Grupo> findByIdAnalises(
        @Param("ids") List<Long> ids,
        @Param("identificador") String identificador,
        @Param("sistema") String sistema,
        @Param("metodo") String metodo,
        @Param("organizacao") String organizacao,
        @Param("equipe") String equipe,
        @Param("usuario") String usuario, Pageable pageable);


}
