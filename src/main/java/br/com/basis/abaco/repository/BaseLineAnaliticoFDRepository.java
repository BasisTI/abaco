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

    @Query( value = "SELECT br.com.basis.abaco.domain.BaseLineAnaliticoFD(f.id, f.idfuncaodados, f.idsistema, f.equipeResponsavelId, f.classificacao, f.analiseid, f.dataHomologacao, f.nome, f.nomeEquipe, f.sigla, f.name, f.pf, f.complexidade, f.der, f.rlralr, f.nomeFuncionalidade, f.nomeModulo) FROM fc_funcao_dados_vw( ?1 ,?2) f",  nativeQuery = true)
    List<BaseLineAnaliticoFD> getAllAnaliticosFDByIdandIdequipe(Long id, Long idEquipe);


    Page<BaseLineAnaliticoFD> getAllByIdsistemaAndEquipeResponsavelId(Long id, Long idEquipe, Pageable pageable);

    List<BaseLineAnaliticoFD> getAllByIdsistema(Long id);

    List<BaseLineAnaliticoFD> getAllByIdsistemaAndEquipeResponsavelId(Long id, Long idEquipe);

    void deleteAllByIdsistemaAndEquipeResponsavelId(Long id, Long idEquipe);
}
