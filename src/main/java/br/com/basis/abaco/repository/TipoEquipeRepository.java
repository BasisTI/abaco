package br.com.basis.abaco.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.basis.abaco.domain.TipoEquipe;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

/**
 * Spring Data JPA repository for the TipoEquipe entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TipoEquipeRepository extends JpaRepository<TipoEquipe, Long> {

    /**
     * Get list of systems by organizations
     *
     * @param organizacao
     * @return
     */
    List<TipoEquipe> findAllByOrganizacoes_Id(Long idOrganizacao);

}
