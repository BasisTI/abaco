package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.domain.TipoEquipe;
import br.com.basis.abaco.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    Optional<Analise> findOneById (Long id);

    @Query( value = "SELECT * FROM ANALISE WHERE created_by_id = ?1", nativeQuery = true)
    List<Analise> findByCreatedBy (Long userid);

    @Query( value = "SELECT a FROM Analise a WHERE a.id IN :idAnalise")
    Page<Analise> findById (@Param("idAnalise") List<Long> idAnalises, Pageable pageable);

//    @Query( value = "SELECT a.id FROM analise a WHERE a.equipe_responsavel_id IN :equipeId", nativeQuery = true)
//    List<Analise> findAllByTipoEquipesId (@Param("equipes") Long equipeId);
}
