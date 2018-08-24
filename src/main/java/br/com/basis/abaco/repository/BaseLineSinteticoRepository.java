package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.BaseLineSintetico;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.Set;


/**
 * Spring Data JPA repository for the BaseLineSintetico entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BaseLineSinteticoRepository extends JpaRepository<BaseLineSintetico, Long> {

    @Query(value = "SELECT * FROM baseline_analitico" , nativeQuery = true)
    public Set<BaseLineSintetico> getBaseLineSintetico();

}
