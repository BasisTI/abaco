package br.com.basis.abaco.service;

import br.com.basis.abaco.domain.EsforcoFase;
import br.com.basis.abaco.repository.EsforcoFaseRepository;
import br.com.basis.abaco.repository.search.EsforcoFaseSearchRepository;
import br.com.basis.abaco.service.dto.EsforcoFaseDTO;
import br.com.basis.abaco.service.mapper.EsforcoFaseMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
public class EsforcoFaseService {

    private final EsforcoFaseRepository esforcoFaseRepository;

    private final EsforcoFaseSearchRepository esforcoFaseSearchRepository;

    private final EsforcoFaseMapper esforcoFaseMapper;

    public EsforcoFaseService(EsforcoFaseRepository esforcoFaseRepository, EsforcoFaseSearchRepository esforcoFaseSearchRepository, EsforcoFaseMapper esforcoFaseMapper) {
        this.esforcoFaseRepository = esforcoFaseRepository;
        this.esforcoFaseSearchRepository = esforcoFaseSearchRepository;
        this.esforcoFaseMapper = esforcoFaseMapper;
    }

    public Boolean existFase(Long id) {
        return esforcoFaseRepository.existsByFaseId(id);
    }

    public EsforcoFaseDTO save(EsforcoFaseDTO esforcoFaseDTO) {
        EsforcoFase esforcoFase = esforcoFaseMapper.toEntity(esforcoFaseDTO);
        EsforcoFase result = esforcoFaseRepository.save(esforcoFase);
        esforcoFaseSearchRepository.save(result);
        return esforcoFaseMapper.toDto(result);
    }
}
