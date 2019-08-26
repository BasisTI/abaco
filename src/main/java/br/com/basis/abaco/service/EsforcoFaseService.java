package br.com.basis.abaco.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.basis.abaco.repository.EsforcoFaseRepository;
import lombok.RequiredArgsConstructor;


@Service
@Transactional
@RequiredArgsConstructor
public class EsforcoFaseService {

    private final EsforcoFaseRepository repository;

    public Boolean existFase(Long id) {
        return repository.existsByFaseId(id);
    }

}
