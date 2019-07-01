package br.com.basis.abaco.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.basis.abaco.repository.FuncionalidadeRepository;
import br.com.basis.abaco.service.dto.DropdownDTO;

@Service
@Transactional
public class FuncionalidadeService {

    private final FuncionalidadeRepository funcionalidadeRepository;

    public FuncionalidadeService(FuncionalidadeRepository funcionalidadeRepository) {
        this.funcionalidadeRepository = funcionalidadeRepository;
    }

    @Transactional(readOnly = true)
    public List<DropdownDTO> findDropdownByModuloId(Long idModulo) {
        return funcionalidadeRepository.findDropdownByModuloId(idModulo);
    }

}
