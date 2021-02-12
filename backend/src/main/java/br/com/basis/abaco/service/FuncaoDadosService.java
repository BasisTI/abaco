package br.com.basis.abaco.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.basis.abaco.repository.FuncaoDadosRepository;
import br.com.basis.abaco.service.dto.DropdownDTO;

@Service
@Transactional
public class FuncaoDadosService {

    private final FuncaoDadosRepository funcaoDadosRepository;

    public FuncaoDadosService(FuncaoDadosRepository funcaoDadosRepository) {
        this.funcaoDadosRepository = funcaoDadosRepository;
    }

    @Transactional(readOnly = true)
    public List<DropdownDTO> getFuncaoDadosDropdown() {
        return funcaoDadosRepository.getFuncaoDadosDropdown();
    }

}
