package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Perfil;
import br.com.basis.abaco.domain.Permissao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Spring Data  repository for the Permissao entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PermissaoRepository extends JpaRepository<Permissao, Long> {

    Optional<Permissao> findById(Long id);

    Optional<List<Permissao>> findAllByPerfils(Perfil perfil);

    @Query("SELECT p from Permissao p ORDER BY p.funcionalidadeAbaco.nome, p.acao.descricao")
    List<Permissao> findAllByFuncionalidadeAbaco();

    @Query("SELECT DISTINCT p FROM Permissao p " +
        "INNER JOIN p.perfils perfil " +
        "WHERE perfil.nome in(:perfis)")
    Optional<List<Permissao>> pesquisarPermissoesPorPerfil(@Param("perfis") Set<String> perfis);
}
