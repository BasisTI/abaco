package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.PEAnaliticoEstimada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface PEAnaliticoEstimadaRepository extends JpaRepository<PEAnaliticoEstimada, Long> {

    Set<PEAnaliticoEstimada> findAllByidsistemaAndTipoOrderByName(Long idsistema, String tipo);

    Set<PEAnaliticoEstimada> findByIdFuncionalidadeAndTipoAndNameContainingIgnoreCaseOrderByName(Long idFuncionalidade, String tipo, String name);

    Set<PEAnaliticoEstimada> findAllByIdModuloAndTipoOrderByName(Long idModulo, String tipo);

    Set<PEAnaliticoEstimada> findAllByIdFuncionalidadeAndTipoOrderByName(Long idFuncionalidade, String tipo);

    Set<PEAnaliticoEstimada> findAllByIdModuloAndTipoAndNameContainsIgnoreCaseOrderByName(Long idmodulo, String tipo, String name);

    Set<PEAnaliticoEstimada> findAllByIdFuncionalidadeAndTipoAndNameContainsIgnoreCaseOrderByName(Long idFuncionalidade, String tipo, String name);

    Set<PEAnaliticoEstimada> findAllByidsistemaAndTipoAndNameContainsIgnoreCaseOrderByName(Long idsistema, String tipo, String name);
}
