package br.com.basis.abaco.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    Optional<Sistema> findBySigla(String sigla);

    Set<Sistema> findAllByOrganizacaoId(Long id);

    @Override
    @EntityGraph(attributePaths = {"modulos"})
    Sistema findOne(Long id);

    @Query("SELECT new br.com.basis.abaco.service.dto.SistemaDropdownDTO(s.id, s.nome, s.organizacao.id, s.organizacao.sigla) FROM Sistema s")
    List<SistemaDropdownDTO> getSistemaDropdown();

    @Query("SELECT s from Sistema s where (:nome is null or s.nome like CAST(CONCAT('%', :nome, '%') AS text)) "
            + "AND (:sigla is null or s.sigla like CAST(CONCAT('%', :sigla, '%') AS text)) "
            + "AND (:numeroOcorrencia is null or s.numeroOcorrencia like CAST(CONCAT('%', :numeroOcorrencia, '%') AS text)) "
            + "AND (:organizacao is null or s.organizacao.id = :organizacao) ")
    Page<Sistema> consultarSistemaPorFiltro(@Param("nome") String nome, @Param("sigla") String sigla, @Param("numeroOcorrencia") String numeroOcorrencia, @Param("organizacao") Long organizacao, Pageable pageable);

}
