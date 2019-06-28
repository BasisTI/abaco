package br.com.basis.abaco.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.basis.abaco.domain.TipoEquipe;
import br.com.basis.abaco.service.dto.DropdownDTO;

/**
 * Spring Data JPA repository for the TipoEquipe entity.
 */
@Repository
public interface TipoEquipeRepository extends JpaRepository<TipoEquipe, Long> {

    /**
     * Get list of systems by organizations
     *
     * @param idOrganizacao
     * @return
     */
    @Query("select t from TipoEquipe t join t.organizacoes o where o.id=:idOrganizacao")
    List<TipoEquipe> findAllEquipesByOrganizacaoId(@Param("idOrganizacao") Long idOrganizacao);

    @Query("select t from TipoEquipe t join t.usuarios u join t.organizacoes o where u.login=:login and o.id=:idOrganizacao")
    List<TipoEquipe> findAllByOrganizacaoAndUsuario(@Param("login") String login, @Param("idOrganizacao") Long idOrganizacao);

    @Query(value = "SELECT t.tipo_equipe_id FROM user_tipo_equipe t where t.user_id = :idUser", nativeQuery = true)
    List<Long> findAllByUserId(@Param("idUser") Long idUser);

    @Query(value = "SELECT e.* FROM tipo_equipe e LEFT JOIN tipoequipe_organizacao eo ON e.id = eo.tipoequipe_id WHERE organizacao_id = :idOrg AND e.id NOT IN (SELECT ac.equipe_id FROM analise_compartilhada ac WHERE analise_id = :idAnalise) AND e.id != :idEquipe" ,nativeQuery = true)
    List<TipoEquipe> findAllEquipesCompartilhaveis(@Param("idOrg") Long idOrg, @Param("idEquipe") Long idEquipe, @Param("idAnalise") Long idAnalise);

    @Query("SELECT new br.com.basis.abaco.service.dto.DropdownDTO(e.id, e.nome) FROM TipoEquipe e")
    List<DropdownDTO> getTipoEquipeDropdown();

    @Query(value = "SELECT new br.com.basis.abaco.service.dto.DropdownDTO(t.id, t.nome) FROM User u JOIN u.tipoEquipes t "
            + " WHERE u.login = :currentUserLogin AND u.activated IS TRUE ")
    List<DropdownDTO> findActiveUserTipoEquipes(@Param("currentUserLogin") String currentUserLogin);

}
