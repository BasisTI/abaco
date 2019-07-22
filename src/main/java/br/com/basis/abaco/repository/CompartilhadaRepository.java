package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Compartilhada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigInteger;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the Compartilhada entity.
 */
@SuppressWarnings("unused")
public interface CompartilhadaRepository extends JpaRepository<Compartilhada,Long> {
    Optional<Compartilhada> findOneById(Long id);

    List<Compartilhada> findAllByAnaliseId(Long id);

    // Query para gerar lista de id's das análises compartilhadas com as equipes
    @Query(value = "SELECT a.analiseId FROM Compartilhada a WHERE a.equipeId IN :idEquipes")
    List<BigInteger> findByEquipeId(@Param("idEquipes") List<Long> idEquipes);

    Boolean existsByAnaliseId(Long analiseId);

}
