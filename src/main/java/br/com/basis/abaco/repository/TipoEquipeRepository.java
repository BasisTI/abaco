package br.com.basis.abaco.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
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
     * @param idOrganizacao
     * @return
     */
    List<TipoEquipe> findAllByOrganizacoes_Id(Long idOrganizacao);

    @Query(value = "SELECT t.tipo_equipe_id FROM user_tipo_equipe t where t.user_id = :idUser", nativeQuery = true)
    List<Long> findAllByUserId(@Param("idUser") Long idUser);

    @Query(value = "SELECT e.* FROM tipo_equipe e LEFT JOIN tipoequipe_organizacao eo ON e.id = eo.tipoequipe_id WHERE organizacao_id = :idOrg AND e.id NOT IN (SELECT ac.equipe_id FROM analise_compartilhada ac WHERE analise_id = :idAnalise) AND e.id != :idEquipe" ,nativeQuery = true)
    List<TipoEquipe> findAllEquipesCompartilhaveis(@Param("idOrg") Long idOrg, @Param("idEquipe") Long idEquipe, @Param("idAnalise") Long idAnalise);

}
