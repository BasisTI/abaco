package br.com.basis.abaco.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import br.com.basis.abaco.domain.Organizacao;
import br.com.basis.abaco.service.dto.OrganizacaoDropdownDTO;

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

    @Override
	@EntityGraph(attributePaths = {"sistemas","contracts","tipoEquipe"})
    Organizacao findOne(Long id);

	@Query("SELECT new br.com.basis.abaco.service.dto.OrganizacaoDropdownDTO(o.id, o.nome, o.cnpj) FROM Organizacao o")
	List<OrganizacaoDropdownDTO> getOrganizacaoDropdown();

}
