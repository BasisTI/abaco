package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.BaseLineAnalitico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;


/**
 * Spring Data JPA repository for the BaseLineAnalitico entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BaseLineAnaliticoRepository extends JpaRepository<BaseLineAnalitico, Long> {

    @Query( value = "SELECT * FROM baseline_analitico where id_sistema = ?1 AND tipo = 'ft'", nativeQuery = true)
    List<BaseLineAnalitico> getAllAnaliticosFT(Long id);

    @Query( value = "SELECT * FROM baseline_analitico where id_sistema = ?1 AND tipo = 'fd'", nativeQuery = true)
    List<BaseLineAnalitico> getAllAnaliticosFD(Long id);

    @Query( value = "select * from baseline_analitico", nativeQuery = true)
    Set<BaseLineAnalitico> getAllAnaliticos();

    @Query( value = "SELECT * FROM baseline_analitico where id_sistema = ?1 AND tipo = 'ft' AND equipe_responsavel_id = ?2", nativeQuery = true)
    List<BaseLineAnalitico> getAllAnaliticosFTEquipe(Long id, Long idEquipe);

    @Query( value = "SELECT * FROM baseline_analitico where id_sistema = ?1 AND tipo = 'fd' AND equipe_responsavel_id = ?2", nativeQuery = true)
    List<BaseLineAnalitico> getAllAnaliticosFDEquipe(Long id, Long idEquipe);

}
