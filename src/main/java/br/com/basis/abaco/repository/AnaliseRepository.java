package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Analise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

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

}
