package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.BaseLineAnaliticoFD;
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
public interface BaseLineAnaliticoFDRepository extends JpaRepository<BaseLineAnaliticoFD, Long> {

    @Query( value = "SELECT b FROM BaseLineAnaliticoFD b where b.idsistema = ?1 ORDER BY b.nomeFuncionalidade asc, b.name asc")
    List<BaseLineAnaliticoFD> getAllAnaliticosFD(Long id);

    Page<BaseLineAnaliticoFD> getAllByIdsistemaAndEquipeResponsavelId(Long id, Long idEquipe, Pageable pageable);

    List<BaseLineAnaliticoFD> getAllByIdsistema(Long id);

}
