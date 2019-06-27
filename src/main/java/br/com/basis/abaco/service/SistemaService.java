package br.com.basis.abaco.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.basis.abaco.repository.SistemaRepository;
import br.com.basis.abaco.service.dto.SistemaDropdownDTO;

@Service
@Transactional
public class SistemaService {

    private final SistemaRepository sistemaRepository;

    public SistemaService(SistemaRepository sistemaRepository) {
        this.sistemaRepository = sistemaRepository;
    }

    @Transactional(readOnly = true)
    public List<SistemaDropdownDTO> getSistemaDropdown() {
        return sistemaRepository.getSistemaDropdown();
    }

}
