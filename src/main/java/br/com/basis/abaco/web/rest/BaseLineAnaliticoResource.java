package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.FuncaoDados;
import br.com.basis.abaco.repository.FuncaoDadosRepository;
import br.com.basis.abaco.domain.BaseLineSintetico;
import br.com.basis.abaco.reports.rest.RelatorioBaselineRest;
import com.codahale.metrics.annotation.Timed;
import br.com.basis.abaco.domain.BaseLineAnalitico;

import br.com.basis.abaco.repository.BaseLineAnaliticoRepository;
import br.com.basis.abaco.repository.BaseLineSinteticoRepository;
import net.sf.jasperreports.engine.JRException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import java.util.ArrayList;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Set;

/**
 * REST controller for managing BaseLineAnalitico.
 */
@RestController
@RequestMapping("/api")
public class BaseLineAnaliticoResource {

    private final Logger log = LoggerFactory.getLogger(BaseLineAnaliticoResource.class);

    private final BaseLineAnaliticoRepository baseLineAnaliticoRepository;
    private final FuncaoDadosRepository funcaoDadosRepository;

    private final BaseLineSinteticoRepository baseLineSinteticoRepository;

    private RelatorioBaselineRest relatorioBaselineRest;

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private HttpServletResponse response;


    public BaseLineAnaliticoResource(BaseLineAnaliticoRepository baseLineAnaliticoRepository, FuncaoDadosRepository funcaoDadosRepository, BaseLineSinteticoRepository baseLineSinteticoRepository) {
        this.baseLineAnaliticoRepository = baseLineAnaliticoRepository;
        this.baseLineSinteticoRepository = baseLineSinteticoRepository;
        this.funcaoDadosRepository = funcaoDadosRepository;
    }

    private BaseLineSintetico recuperarBaselinePorSistema(Long id){
        return baseLineSinteticoRepository.getBaseLineSinteticoId(id);
    }


    /**
     * GET  /base-line-analiticos : get all the baseLineAnaliticos.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of baseLineAnaliticos in body
     */
    @GetMapping("/baseline-analiticos")
    @Timed
    public Set<BaseLineAnalitico> getAllBaseLineAnaliticos() {
        log.debug("REST request to get all BaseLineAnaliticos");
        return baseLineAnaliticoRepository.getAllAnaliticos();
    }


    @GetMapping("/baseline-analiticos/fd/{id}")
    @Timed
    public List<BaseLineAnalitico> getBaseLineAnaliticoFD(@PathVariable Long id) {
        log.debug("REST request to get FD BaseLineAnalitico : {}", id);
        return baseLineAnaliticoRepository.getAllAnaliticosFD(id);
    }

    @GetMapping("/baseline-analiticos/ft/{id}")
    @Timed
    public List<BaseLineAnalitico> getBaseLineAnaliticoFT(@PathVariable Long id) {
        log.debug("REST request to get FT BaseLineAnalitico : {}", id);
        return baseLineAnaliticoRepository.getAllAnaliticosFT(id);
    }

    @GetMapping("/baseline-analiticos/funcao-dados/{id}")
    @Timed
    public List<FuncaoDados> getFDBaseline(@PathVariable Long id) {
        log.debug("REST request to get FD BaseLineAnalitico : {}", id);
        List<BaseLineAnalitico> integerList = baseLineAnaliticoRepository.getAllAnaliticosFD(id);
        List<FuncaoDados> fds = new ArrayList<>();

        for (BaseLineAnalitico baseLineAnalitico : integerList){
            Long idFuncaoDados = baseLineAnalitico.getIdfuncaodados();

            if(idFuncaoDados != null){
                FuncaoDados fd = funcaoDadosRepository.findById(idFuncaoDados);
                fds.add(fd);
            }
        }

        return fds;
    }
    
    @GetMapping("/downloadPdfBaselineBrowser/{id}")
    @Timed
    public @ResponseBody
    byte[] downloadPdfBaselineBrowser(@PathVariable Long id) throws URISyntaxException, IOException, JRException {
        relatorioBaselineRest = new RelatorioBaselineRest(this.response,this.request);
        log.debug("REST request to generate report Analise baseline in browser : {}", recuperarBaselinePorSistema(id));
        return relatorioBaselineRest.downloadPdfBaselineBrowser(recuperarBaselinePorSistema(id), getBaseLineAnaliticoFD(id), getBaseLineAnaliticoFT(id));
    }

}
