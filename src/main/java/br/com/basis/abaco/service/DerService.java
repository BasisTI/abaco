package br.com.basis.abaco.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.basis.abaco.repository.DerRepository;
import br.com.basis.abaco.service.dto.DropdownDTO;

@Service
@Transactional
public class DerService {

    private final DerRepository derRepository;

    public DerService(DerRepository derRepository) {
        this.derRepository = derRepository;
    }

    @Transactional(readOnly = true)
    public List<DropdownDTO> getDerByFuncaoDadosIdDropdown(Long idFuncaoDados) {
        return derRepository.getDerByFuncaoDadosIdDropdown(idFuncaoDados);
    }

}
