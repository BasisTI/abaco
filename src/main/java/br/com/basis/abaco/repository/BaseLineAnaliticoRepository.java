package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.BaseLineAnalitico;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Spring Data JPA repository for the BaseLineAnalitico entity.
 */
@Repository
public interface BaseLineAnaliticoRepository extends JpaRepository<BaseLineAnalitico, Long> {

    @Query( value = "SELECT b FROM BaseLineAnalitico b where b.idsistema = ?1 AND b.tipo = 'ft' ORDER BY b.nomeFuncionalidade asc, b.name asc")
    List<BaseLineAnalitico> getAllAnaliticosFT(Long id);

    @Query( value = "SELECT b FROM BaseLineAnalitico b where b.idsistema = ?1 AND b.tipo = 'fd' ORDER BY b.nomeFuncionalidade asc, b.name asc")
    List<BaseLineAnalitico> getAllAnaliticosFD(Long id);

    Page<BaseLineAnalitico> getAllByIdsistemaAndEquipeResponsavelIdAndTipo(Long id, Long idEquipe, String ft,Pageable pageable);

}
