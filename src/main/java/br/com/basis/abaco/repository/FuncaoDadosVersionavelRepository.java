package br.com.basis.abaco.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.basis.abaco.domain.FuncaoDadosVersionavel;

public interface FuncaoDadosVersionavelRepository extends JpaRepository<FuncaoDadosVersionavel, Long> {

    Optional<FuncaoDadosVersionavel> findOneByNomeIgnoreCaseAndSistemaId(String nome, Long sistemaId);

    List<FuncaoDadosVersionavel> findAllBySistemaId(Long sistemaId);

}
