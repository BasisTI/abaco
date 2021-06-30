package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Acao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.nio.channels.FileChannel;
import java.util.Optional;

/**
 * Spring Data  repository for the Acao entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AcaoRepository extends JpaRepository<Acao, Long> {

    Optional<Acao> findById(Long id);

    Optional<Acao> findBySigla(String sigla);
}
