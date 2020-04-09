package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.PEAnalitico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;


/**
 * Spring Data JPA repository for the BaseLineAnalitico entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PEAnaliticoRepository extends JpaRepository<PEAnalitico, Long> {

    Set<PEAnalitico> findAllByidsistemaAndTipoOrderByName(Long idsistema, String tipo);

    Set<PEAnalitico> findByIdFuncionalidadeAndTipoAndNameContainingIgnoreCaseOrderByName(Long idFuncionalidade, String tipo, String name);

    Set<PEAnalitico> findAllByIdModuloAndTipoOrderByName(Long idModulo, String tipo);

    Set<PEAnalitico> findAllByIdFuncionalidadeAndTipoOrderByName(Long idFuncionalidade, String tipo);
}
