package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.VwFuncaoTransacao;
import br.com.basis.abaco.repository.VwFuncaoTransacaoRepository;
import com.codahale.metrics.annotation.Timed;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping("/api")
public class VwFuncaoTransacaoResource {

    private final VwFuncaoTransacaoRepository vwFuncaoTransacaoRepository;

    public VwFuncaoTransacaoResource(VwFuncaoTransacaoRepository vwFuncaoTransacaoRepository) {
        this.vwFuncaoTransacaoRepository = vwFuncaoTransacaoRepository;
    }

    @GetMapping("/vw-funcao-transacaos/{analiseId}")
    @Timed
    public Set<VwFuncaoTransacao> getFuncaoBySistemaAndModuloAndFuncionalidade(@PathVariable Long analiseId) {
        return vwFuncaoTransacaoRepository.findByAnaliseIdOrderById(analiseId);
    }

    @GetMapping("/vw-funcao-transacaos/id/{id}")
    @Timed
    public VwFuncaoTransacao getFuncaoDadosById(@PathVariable Long id){
        return vwFuncaoTransacaoRepository.findOne(id);
    }

}
