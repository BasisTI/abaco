package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.VwAnaliseFT;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VwAnaliseFTRepository extends JpaRepository<VwAnaliseFT, Long> {

    @Query("SELECT vw FROM VwAnaliseFT as vw WHERE vw.funcaoNome = :nomeFuncao AND vw.moduloNome = :nomeModulo AND vw.funcionalidadeNome = :nomeFuncionalidade")
    List<VwAnaliseFT> findAllByFuncaoNomeAndFuncionalidadeNomeAndModuloNome(@Param("nomeFuncao")String nomeFuncao, @Param("nomeModulo")String nomeModulo, @Param("nomeFuncionalidade")String nomeFuncionalidade);

}
