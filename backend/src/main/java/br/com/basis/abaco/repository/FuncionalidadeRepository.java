package br.com.basis.abaco.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.basis.abaco.domain.Funcionalidade;
import br.com.basis.abaco.service.dto.DropdownDTO;

/**
 * Spring Data JPA repository for the Funcionalidade entity.
 */
public interface FuncionalidadeRepository extends JpaRepository<Funcionalidade, Long> {

    @Query(value = "SELECT new br.com.basis.abaco.service.dto.DropdownDTO(f.id, f.nome) FROM Funcionalidade f WHERE f.modulo.id = :idModulo ")
    List<DropdownDTO> findDropdownByModuloId(@Param("idModulo") Long idModulo);

    @Query(value = "SELECT f FROM Funcionalidade f WHERE lower(f.nome) = :nome AND f.modulo.id = :moduloId")
    Optional<List<Funcionalidade>> findAllByNomeAndModuloId(@Param("nome") String nome, @Param("moduloId") Long moduloId);
}
