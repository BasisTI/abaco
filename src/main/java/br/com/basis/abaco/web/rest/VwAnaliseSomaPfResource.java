package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.VwResumo;
import br.com.basis.abaco.domain.VwResumoDivergencia;
import br.com.basis.abaco.repository.VwResumoDivergenteRepository;
import br.com.basis.abaco.repository.VwResumoRepository;
import br.com.basis.abaco.security.AuthoritiesConstants;
import com.codahale.metrics.annotation.Timed;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping("/api")
public class VwAnaliseSomaPfResource {
    private final VwResumoRepository vwResumoRepository;
    private final VwResumoDivergenteRepository vwResumoDivergenteRepository;

    public VwAnaliseSomaPfResource(VwResumoRepository vwResumoRepository, VwResumoDivergenteRepository vwResumoDivergenteRepository) {
        this.vwResumoDivergenteRepository =  vwResumoDivergenteRepository;
        this.vwResumoRepository = vwResumoRepository;
    }

    @GetMapping("/analise-pf/{analiseId}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.GESTOR, AuthoritiesConstants.ANALISTA})
    public Set<VwResumo> getResumo(@PathVariable Long analiseId) {
        return vwResumoRepository.findByAnaliseIdOrderByTipoAsc(analiseId);
    }

    @GetMapping("/analise-pf/divergencia/{analiseId}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.GESTOR, AuthoritiesConstants.ANALISTA})
    public Set<VwResumoDivergencia> getResumoDivergencia(@PathVariable Long analiseId) {
        return vwResumoDivergenteRepository.findByAnaliseIdOrderByTipoAsc(analiseId);
    }
}
