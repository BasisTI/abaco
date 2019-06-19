package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.BaseLineSintetico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the BaseLineSintetico entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BaseLineSinteticoRepository extends JpaRepository<BaseLineSintetico, Long> {

    public BaseLineSintetico findOneByIdsistema(Long id);

    public BaseLineSintetico findOneByIdsistemaAndEquipeResponsavelId(Long id, Long idEquipe);

}
