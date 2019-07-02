package br.com.basis.abaco.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import br.com.basis.abaco.domain.Organizacao;
import br.com.basis.abaco.domain.Sistema;
import br.com.basis.abaco.service.dto.SistemaDropdownDTO;

/**
 * Spring Data JPA repository for the Sistema entity.
 */
public interface SistemaRepository extends JpaRepository<Sistema, Long> {

    /**
     * Get list of systems by organizations
     *
     * @param organizacao
     * @return
     */
    List<Sistema> findAllByOrganizacao(Organizacao organizacao);

    Set<Sistema> findAllByOrganizacaoId(Long id);

    @Override
    @EntityGraph(attributePaths = "modulos")
    Sistema findOne(Long id);

    @Query("SELECT new br.com.basis.abaco.service.dto.SistemaDropdownDTO(s.id, s.nome, s.organizacao.id) FROM Sistema s")
    List<SistemaDropdownDTO> getSistemaDropdown();

}
