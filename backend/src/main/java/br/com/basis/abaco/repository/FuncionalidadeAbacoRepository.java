package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.FuncionalidadeAbaco;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Spring Data  repository for the FuncionalidadeAbaco entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FuncionalidadeAbacoRepository extends JpaRepository<FuncionalidadeAbaco, Long> {

    Optional<FuncionalidadeAbaco> findById(Long id);

    Optional<FuncionalidadeAbaco> findBySigla(String sigla);
}
