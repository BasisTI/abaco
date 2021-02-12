package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.PEAnalitico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface PEAnaliticoRepository extends JpaRepository<PEAnalitico, Long> {

    Set<PEAnalitico> findAllByidsistemaAndTipoOrderByName(Long idsistema, String tipo);

    Set<PEAnalitico> findByIdFuncionalidadeAndTipoAndNameContainingIgnoreCaseOrderByName(Long idFuncionalidade, String tipo, String name);

    Set<PEAnalitico> findAllByIdModuloAndTipoOrderByName(Long idModulo, String tipo);

    Set<PEAnalitico> findAllByIdFuncionalidadeAndTipoOrderByName(Long idFuncionalidade, String tipo);

    Set<PEAnalitico> findAllByIdModuloAndTipoAndNameContainsIgnoreCaseOrderByName(Long idmodulo, String tipo, String name);

    Set<PEAnalitico> findAllByIdFuncionalidadeAndTipoAndNameContainsIgnoreCaseOrderByName(Long idFuncionalidade, String tipo, String name);

    Set<PEAnalitico> findAllByidsistemaAndTipoAndNameContainsIgnoreCaseOrderByName(Long idsistema, String tipo, String name);
}
