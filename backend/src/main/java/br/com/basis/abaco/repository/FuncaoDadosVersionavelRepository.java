package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.FuncaoDadosVersionavel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.Set;

public interface FuncaoDadosVersionavelRepository extends JpaRepository<FuncaoDadosVersionavel, Long> {

    Optional<FuncaoDadosVersionavel> findOneByNomeIgnoreCaseAndSistemaId(String nome, Long sistemaId);

    Set<FuncaoDadosVersionavel> findAllBySistemaId(Long sistemaId);

}
