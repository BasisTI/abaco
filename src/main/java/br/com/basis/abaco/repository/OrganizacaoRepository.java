package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Organizacao;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the Organizacao entity.
 */
@SuppressWarnings("unused")
public interface OrganizacaoRepository extends JpaRepository<Organizacao, Long> {

    List<Organizacao> findByAtivoTrue();

    @Query(value = "SELECT o FROM Organizacao o where o.ativo = true")
    List<Organizacao> searchActiveOrganizations();

    @EntityGraph(attributePaths = {"sistemas","contracts","tipoEquipe"})
    Optional<Organizacao> findOneByNome(String nome);

    @EntityGraph(attributePaths = {"sistemas","contracts","tipoEquipe"})
    Optional<Organizacao> findOneByCnpj(String cnpj);

    @EntityGraph(attributePaths = {"sistemas","contracts","tipoEquipe"})
    Organizacao findOne(Long id);

}
