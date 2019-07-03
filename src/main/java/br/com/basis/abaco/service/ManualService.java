package br.com.basis.abaco.service;

import br.com.basis.abaco.repository.ManualRepository;
import br.com.basis.abaco.service.dto.DropdownDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ManualService {

    private final ManualRepository manualRepository;

    public ManualService(ManualRepository manualRepository) {
        this.manualRepository = manualRepository;
    }

    public List<DropdownDTO> getManuaisDropdownDTO() {
        return manualRepository.getManualDropdow();
    }
}
