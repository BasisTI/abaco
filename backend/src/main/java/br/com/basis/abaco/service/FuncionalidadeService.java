package br.com.basis.abaco.service;

import br.com.basis.abaco.domain.FuncaoDados;
import br.com.basis.abaco.domain.FuncaoTransacao;
import br.com.basis.abaco.domain.Funcionalidade;
import br.com.basis.abaco.repository.FuncaoDadosRepository;
import br.com.basis.abaco.repository.FuncaoTransacaoRepository;
import br.com.basis.abaco.repository.FuncionalidadeRepository;
import br.com.basis.abaco.repository.search.FuncaoDadosSearchRepository;
import br.com.basis.abaco.repository.search.FuncaoTransacaoSearchRepository;
import br.com.basis.abaco.repository.search.FuncionalidadeSearchRepository;
import br.com.basis.abaco.service.dto.DropdownDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class FuncionalidadeService {

    private final FuncionalidadeRepository funcionalidadeRepository;
    private final FuncaoDadosRepository funcaoDadosRepository;
    private final FuncaoDadosSearchRepository funcaoDadosSearchRepository;
    private final FuncaoTransacaoRepository funcaoTransacaoRepository;
    private final FuncaoTransacaoSearchRepository funcaoTransacaoSearchRepository;
    private final FuncionalidadeSearchRepository funcionalidadeSearchRepository;

    public FuncionalidadeService(FuncionalidadeRepository funcionalidadeRepository, FuncaoTransacaoRepository funcaoTransacaoRepository, FuncaoDadosRepository funcaoDadosRepository, FuncaoDadosSearchRepository funcaoDadosSearchRepository, FuncaoTransacaoSearchRepository funcaoTransacaoSearchRepository, FuncionalidadeSearchRepository funcionalidadeSearchRepository) {
        this.funcionalidadeRepository = funcionalidadeRepository;
        this.funcaoTransacaoRepository = funcaoTransacaoRepository;
        this.funcaoDadosRepository = funcaoDadosRepository;
        this.funcaoDadosSearchRepository = funcaoDadosSearchRepository;
        this.funcaoTransacaoSearchRepository = funcaoTransacaoSearchRepository;
        this.funcionalidadeSearchRepository = funcionalidadeSearchRepository;
    }

    @Transactional(readOnly = true)
    public List<DropdownDTO> findDropdownByModuloId(Long idModulo) {
        return funcionalidadeRepository.findDropdownByModuloId(idModulo);
    }

    public Long countTotalFuncao(Long id){
        return this.funcaoDadosRepository.countByFuncionalidadeId(id) + this.funcaoTransacaoRepository.countByFuncionalidadeId(id);
    }

    public void migrarFuncoes(Long idEdit, Long idMigrar){
        Funcionalidade funcionalidadeMigrar = funcionalidadeRepository.findOne(idMigrar);
        Optional<List<FuncaoDados>> funcaoDados = funcaoDadosRepository.findAllByFuncionalidadeId(idEdit);
        Optional<List<FuncaoTransacao>> funcaoTransacaos = funcaoTransacaoRepository.findAllByFuncionalidadeId(idEdit);

        if(funcaoDados.isPresent()){
            funcaoDados.get().forEach(funcao -> {
                funcao.setFuncionalidade(funcionalidadeMigrar);
            });
            funcaoDadosRepository.save(funcaoDados.get());
            funcaoDadosSearchRepository.save(funcaoDados.get());
        }
        if(funcaoTransacaos.isPresent()){
            funcaoTransacaos.get().forEach(funcao -> {
                funcao.setFuncionalidade(funcionalidadeMigrar);
            });
            funcaoTransacaoRepository.save(funcaoTransacaos.get());
            funcaoTransacaoSearchRepository.save((funcaoTransacaos.get()));
        }
    }
}
