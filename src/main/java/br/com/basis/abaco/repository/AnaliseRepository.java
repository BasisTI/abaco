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

    @Query( value = "SELECT a FROM Analise a WHERE a.createdBy.id = ?1")
    List<Analise> findByCreatedBy (Long userid);

    @Query( value = "SELECT a FROM Analise a WHERE a.id IN :idAnalise")
    Page<Analise> findById (@Param("idAnalise") List<Long> idAnalises, Pageable pageable);

    @Query( value = "SELECT a.id FROM Analise a WHERE a.equipeResponsavel.id IN :equipes")
    List<Long> findAllByTipoEquipesId (@Param("equipes") List<Long> equipes);

    @Query( value = "SELECT a FROM Analise a WHERE a.enviarBaseline = true AND a.bloqueiaAnalise = true")
    List<Analise> findAllByBaseline ();

    @Query(value = "SELECT a FROM Analise a WHERE a.id IN :idAnalise")
    Page<Analise> findByIds(@Param("idAnalise") List<Long> idAnalise, Pageable pageable);

    // ESAS QUERY UTILIZA UNION ALL E PRECISA SER NATIVA
    @Query(value = "SELECT a.id FROM analise a WHERE a.equipe_responsavel_id IN :equipes UNION ALL " +
        "SELECT ac.analise_id FROM analise_compartilhada ac WHERE ac.equipe_id IN :equipes", nativeQuery = true)
    List<BigInteger> listAnalisesEquipe(@Param("equipes") List<Long> equipes);

    @Query(value = "SELECT count(*) FROM Analise a WHERE a.equipeResponsavel.id IN :equipes AND a.id = :idAnalise")
    int analiseEquipe(@Param("idAnalise") Long idAnalise, @Param("equipes") List<Long> equipes);

    @Query( value = "SELECT a.viewOnly FROM Compartilhada a WHERE a.analiseId = ?1")
    Boolean analiseCompartilhada (Long analiseId);

    @EntityGraph(attributePaths = {"compartilhadas","funcaoDados","funcaoTransacaos","esforcoFases","users"})
    Analise findOne(Long id);

    @Query(value = "SELECT a "+
        "FROM Analise a " +
        "JOIN Sistema s              ON s.id = a.sistema.id " +
        "JOIN Organizacao o          ON o.id = a.organizacao.id " +
        "JOIN Modulo m               ON s.id = m.sistema.id " +
        "JOIN Funcionalidade f       ON f.modulo.id = m.id " +
        "JOIN FuncaoDados fd        ON fd.funcionalidade.id = f.id " +
        "JOIN FuncaoTransacao ft    ON ft.funcionalidade.id = f.id " +
        "JOIN FETCH FatorAjuste fa        ON fa.id = fd.fatorAjuste.id OR fa.id = ft.fatorAjuste.id " +
        "WHERE a.id = :id")
    Analise reportContagem(@Param("id")Long id);

    @EntityGraph(attributePaths = {"compartilhadas","funcaoDados","funcaoTransacaos","esforcoFases","users"})
    Optional<Analise> findOneById (Long id);

}
