package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.FuncaoDados;
import br.com.basis.abaco.domain.FuncaoTransacao;
import br.com.basis.abaco.domain.Manual;
import br.com.basis.abaco.domain.UploadedFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Created by roman on 7/8/17.
 */
public interface UploadedFilesRepository extends JpaRepository<UploadedFile, Long> {

    Optional<List<UploadedFile>> findAllByManuais(Manual manual);
    Optional<List<UploadedFile>> findAllByFuncaoDados(FuncaoDados funcaoDados);
    Optional<List<UploadedFile>> findAllByFuncaoTransacao(FuncaoTransacao funcaoTransacao);

}
