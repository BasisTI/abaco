package br.com.basis.abaco.repository;

import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.basis.abaco.domain.FuncaoDadosVersionavel;

public interface FuncaoDadosVersionavelRepository extends JpaRepository<FuncaoDadosVersionavel, Long> {

    Optional<FuncaoDadosVersionavel> findOneByNomeIgnoreCaseAndSistemaId(String nome, Long sistemaId);

    Set<FuncaoDadosVersionavel> findAllBySistemaId(Long sistemaId);

}
