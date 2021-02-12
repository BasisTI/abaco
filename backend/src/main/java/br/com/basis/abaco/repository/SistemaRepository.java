package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Organizacao;
import br.com.basis.abaco.domain.Sistema;
import br.com.basis.abaco.service.dto.SistemaDropdownDTO;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Set;

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
    @EntityGraph(attributePaths = {"modulos", "analises"})
    Sistema findOne(Long id);

    @Query("SELECT new br.com.basis.abaco.service.dto.SistemaDropdownDTO(s.id, s.nome, s.organizacao.id, s.organizacao.sigla) FROM Sistema s")
    List<SistemaDropdownDTO> getSistemaDropdown();

}
