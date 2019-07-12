package br.com.basis.abaco.service;

import br.com.basis.abaco.repository.EsforcoFaseRepository;
import br.com.basis.abaco.repository.search.EsforcoFaseSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
public class EsforcoFaseService {

    private final Logger log = LoggerFactory.getLogger(FaseService.class);

    private final EsforcoFaseRepository esforcoFaseRepository;

    private final EsforcoFaseSearchRepository esforcoFaseSearchRepository;

    public EsforcoFaseService(EsforcoFaseRepository esforcoFaseRepository, EsforcoFaseSearchRepository esforcoFaseSearchRepository) {
        this.esforcoFaseRepository = esforcoFaseRepository;
        this.esforcoFaseSearchRepository = esforcoFaseSearchRepository;
    }

    public Boolean existFase(Long id) {
        return esforcoFaseRepository.existsByFaseId(id);
    }
}
