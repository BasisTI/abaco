package br.com.basis.abaco.service;

import br.com.basis.abaco.repository.FuncaoDadosRepository;
import br.com.basis.abaco.repository.FuncaoTransacaoRepository;
import br.com.basis.abaco.repository.FuncionalidadeRepository;
import br.com.basis.abaco.service.dto.DropdownDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class FuncionalidadeService {

    private final FuncionalidadeRepository funcionalidadeRepository;
    private final FuncaoDadosRepository funcaoDadosRepository;
    private final FuncaoTransacaoRepository funcaoTransacaoRepository;

    public FuncionalidadeService(FuncionalidadeRepository funcionalidadeRepository, FuncaoTransacaoRepository funcaoTransacaoRepository, FuncaoDadosRepository funcaoDadosRepository) {
        this.funcionalidadeRepository = funcionalidadeRepository;
        this.funcaoTransacaoRepository = funcaoTransacaoRepository;
        this.funcaoDadosRepository = funcaoDadosRepository;
    }

    @Transactional(readOnly = true)
    public List<DropdownDTO> findDropdownByModuloId(Long idModulo) {
        return funcionalidadeRepository.findDropdownByModuloId(idModulo);
    }

    public Long countTotalFuncao(Long id){
        return this.funcaoDadosRepository.countByFuncionalidadeId(id) + this.funcaoTransacaoRepository.countByFuncionalidadeId(id);
    }

}
