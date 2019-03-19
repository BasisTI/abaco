package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Analise;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigInteger;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the Analise entity.
 */
@SuppressWarnings("unused")
public interface AnaliseRepository extends JpaRepository<Analise,Long> {

    @Query( value = "SELECT * FROM ANALISE WHERE created_by_id = ?1", nativeQuery = true)
    List<Analise> findByCreatedBy (Long userid);

    @Query( value = "SELECT a FROM Analise a WHERE a.id IN :idAnalise")
    Page<Analise> findById (@Param("idAnalise") List<Long> idAnalises, Pageable pageable);

    @Query( value = "SELECT a.id FROM analise a WHERE a.equipe_responsavel_id IN :equipes", nativeQuery = true)
    List<BigInteger> findAllByTipoEquipesId (@Param("equipes") List<Long> equipes);

    @Query( value = "SELECT * FROM analise a WHERE a.enviar_baseline = true AND a.bloqueado = true", nativeQuery = true)
    List<Analise> findAllByBaseline ();

    @Query(value = "SELECT a FROM Analise a WHERE a.id IN :idAnalise")
    Page<Analise> findByIds(@Param("idAnalise") List<BigInteger> idAnalise, Pageable pageable);

    @Query(value = "SELECT a.id FROM analise a WHERE a.equipe_responsavel_id IN :equipes UNION ALL " +
        "SELECT ac.analise_id FROM analise_compartilhada ac WHERE ac.equipe_id IN :equipes", nativeQuery = true)
    List<BigInteger> listAnalisesEquipe(@Param("equipes") List<Long> equipes);

    @Query(value = "SELECT count(*) FROM analise a WHERE a.equipe_responsavel_id IN :equipes AND a.id = :idAnalise", nativeQuery = true)
    Integer analiseEquipe(@Param("idAnalise") Long idAnalise, @Param("equipes") List<Long> equipes);

    @Query( value = "SELECT view_only FROM analise_compartilhada WHERE analise_id = ?1", nativeQuery = true)
    Boolean analiseCompartilhada (Long analiseId);

    @EntityGraph(attributePaths = {"compartilhadas","funcaoDados","funcaoTransacaos","esforcoFases"})
    Analise findOne(Long id);

    @EntityGraph(attributePaths = {"compartilhadas","funcaoDados","funcaoTransacaos","esforcoFases"})
    Optional<Analise> findOneById (Long id);

}
