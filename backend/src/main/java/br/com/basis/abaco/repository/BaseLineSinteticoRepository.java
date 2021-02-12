package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.BaseLineSintetico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for the BaseLineSintetico entity.
 */
@Repository
public interface BaseLineSinteticoRepository extends JpaRepository<BaseLineSintetico, Long> {

    public List<BaseLineSintetico>findAllByIdsistema(Long id);

    public BaseLineSintetico findOneByIdsistema(Long id);

    public BaseLineSintetico findOneByIdsistemaAndEquipeResponsavelId(Long id, Long idEquipe);

}
