package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.VwFuncaoDados;
import br.com.basis.abaco.repository.VwFuncaoDadosRepository;
import com.codahale.metrics.annotation.Timed;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping("/api")
public class VwFuncaoDadosResource {

    private final VwFuncaoDadosRepository vwFuncaoDadosRepository;

    public VwFuncaoDadosResource(VwFuncaoDadosRepository vwFuncaoDadosRepository) {
        this.vwFuncaoDadosRepository = vwFuncaoDadosRepository;
    }

    @GetMapping("/vw-funcao-dados/{analiseId}")
    @Timed
    public Set<VwFuncaoDados> getFuncaoDadosByAnalise(@PathVariable Long analiseId) {
        return vwFuncaoDadosRepository.findByAnaliseId(analiseId);
    }

}
