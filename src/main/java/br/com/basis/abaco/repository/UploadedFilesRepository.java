package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Sistema;
import br.com.basis.abaco.domain.UploadedFile;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Created by roman on 7/8/17.
 */
public interface UploadedFilesRepository  extends JpaRepository<UploadedFile,Long> {
}
