package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.BaseLineAnalitico;
import br.com.basis.abaco.domain.BaseLineSintetico;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Set;


/**
 * Spring Data JPA repository for the BaseLineSintetico entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BaseLineSinteticoRepository extends JpaRepository<BaseLineSintetico, Long> {

    @Query(value = "SELECT * FROM baseline_sintetico" , nativeQuery = true)
    public List<BaseLineSintetico> getBaseLineSintetico();

    @Query(value = "SELECT * FROM baseline_sintetico WHERE id_sistema = ?1" , nativeQuery = true)
    public BaseLineSintetico getBaseLineSinteticoId(Long id);

    @Query(value = "SELECT * FROM baseline_sintetico WHERE id_sistema = ?1 AND equipe_responsavel_id = ?2" , nativeQuery = true)
    public BaseLineSintetico getBaseLineSinteticoIdEquipe(Long id, Long idEquipe);

    @Query(value = "select * from baseline_analitico where id_sistema = ?1 and tipo = 'fd'" , nativeQuery = true)
    public BaseLineSintetico getAllFuncaoDados(Long id);

    @Query( value = "select * from baseline_analitico", nativeQuery = true)
    Set<BaseLineAnalitico> getAllAnaliticos();

    @Query(value = "SELECT * FROM baseline_sintetico ORDER BY ?#{#pageable}" , nativeQuery = true)
    public Page<BaseLineSintetico> getBaseLineSinteticoRelatorio(Pageable pageable);


}
