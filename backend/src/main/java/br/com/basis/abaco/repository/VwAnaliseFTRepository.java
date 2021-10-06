package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.VwAnaliseFT;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VwAnaliseFTRepository extends JpaRepository<VwAnaliseFT, Long> {

    @Query("SELECT vw FROM VwAnaliseFT as vw WHERE " +
        "vw.funcaoNome LIKE :nomeFuncao% AND " +
        "vw.moduloNome LIKE :nomeModulo% AND " +
        "vw.funcionalidadeNome LIKE :nomeFuncionalidade% AND " +
        "vw.sistemaNome LIKE :nomeSistema% AND " +
        "vw.equipeNome LIKE :nomeEquipe%")
    List<VwAnaliseFT> findAllByFuncao(@Param("nomeFuncao")String nomeFuncao,
                                      @Param("nomeModulo")String nomeModulo,
                                      @Param("nomeFuncionalidade")String nomeFuncionalidade,
                                      @Param("nomeSistema") String nomeSistema,
                                      @Param("nomeEquipe") String nomeEquipe);
}
