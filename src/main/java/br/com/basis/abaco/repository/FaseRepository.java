package br.com.basis.abaco.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.basis.abaco.domain.novo.Fase;

public interface FaseRepository extends JpaRepository<Fase, Long> {

    Boolean existsByNome(String nome);

}
