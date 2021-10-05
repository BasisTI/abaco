package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.VwAnaliseFD;
import br.com.basis.abaco.domain.VwAnaliseFT;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VwAnaliseFTRepository extends JpaRepository<VwAnaliseFT, Long> {

    List<VwAnaliseFT> findAllByFuncaoNomeAndFuncionalidadeNomeAndModuloNome(String nomeFuncao, String nomeModulo, String nomeFuncionalidade);
}
