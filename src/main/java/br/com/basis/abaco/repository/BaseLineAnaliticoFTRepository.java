package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.BaseLineAnaliticoFT;
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
public interface BaseLineAnaliticoFTRepository extends JpaRepository<BaseLineAnaliticoFT, Long> {

    @Query( value = "SELECT b FROM BaseLineAnaliticoFT b where b.idsistema = ?1 ORDER BY b.nomeFuncionalidade asc, b.name asc")
    List<BaseLineAnaliticoFT> getAllAnaliticosFT(Long id);

    Page<BaseLineAnaliticoFT> getAllByIdsistemaAndEquipeResponsavelId(Long id, Long idEquipe, Pageable pageable);

    List<BaseLineAnaliticoFT> getAllByIdsistemaAndEquipeResponsavelId(Long id, Long idEquipe);

    List<BaseLineAnaliticoFT> getAllByIdsistema(Long id);

    void deleteAllByIdsistemaAndEquipeResponsavelId(Long id, Long idEquipe);

}
