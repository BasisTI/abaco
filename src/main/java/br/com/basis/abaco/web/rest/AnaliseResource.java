package br.com.basis.abaco.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;

import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.domain.FuncaoDados;
import br.com.basis.abaco.domain.FuncaoDadosVersionavel;
import br.com.basis.abaco.domain.Sistema;
import br.com.basis.abaco.reports.rest.RelatorioAnaliseRest;
import br.com.basis.abaco.repository.AnaliseRepository;
import br.com.basis.abaco.repository.FuncaoDadosVersionavelRepository;
import br.com.basis.abaco.repository.search.AnaliseSearchRepository;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import br.com.basis.abaco.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;
import net.sf.jasperreports.engine.JRException;

/**
 * REST controller for managing Analise.
 */
@RestController
@RequestMapping("/api")
public class AnaliseResource {

    private final Logger log = LoggerFactory.getLogger(AnaliseResource.class);

    private static final String ENTITY_NAME = "analise";

    private final AnaliseRepository analiseRepository;

    private final AnaliseSearchRepository analiseSearchRepository;

    private final FuncaoDadosVersionavelRepository funcaoDadosVersionavelRepository;
    
    private RelatorioAnaliseRest relatorioAnaliseRest;
    
    @Autowired
    private HttpServletRequest request;
    
    @Autowired
    private HttpServletResponse response;
    
    /**
     * Método construtor.
     * @param analiseRepository
     * @param analiseSearchRepository
     * @param funcaoDadosVersionavelRepository
     */
    public AnaliseResource(
             AnaliseRepository analiseRepository
            ,AnaliseSearchRepository analiseSearchRepository
            ,FuncaoDadosVersionavelRepository funcaoDadosVersionavelRepository) {
        this.analiseRepository = analiseRepository;
        this.analiseSearchRepository = analiseSearchRepository;
        this.funcaoDadosVersionavelRepository = funcaoDadosVersionavelRepository;
    }

    /**
     * POST /analises : Create a new analise.
     *
     * @param analise 
     * the analise to create
     * @return the ResponseEntity with status 201 (Created) and with body the new
     * analise, or with status 400 (Bad Request) if the analise has already an ID
     * @throws URISyntaxException
     * if the Location URI syntax is incorrect
     */
    @PostMapping("/analises")
    @Timed
    public ResponseEntity<Analise> createAnalise(@Valid @RequestBody Analise analise) throws URISyntaxException {
        log.debug("REST request to save Analise : {}", analise);
        if (analise.getId() != null) {
            return ResponseEntity.badRequest().headers(
                    HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new analise cannot already have an ID")).body(null);
        }
        linkFuncoesToAnalise(analise);
        Analise result = analiseRepository.save(analise);
        unlinkAnaliseFromFuncoes(result);
        analiseSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/analises/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString())).body(result);
    }

    /**
     * 
     * @param id
     * @return
     */
    private Analise recuperarAnalise(Long id) {
        return analiseRepository.findOne(id);
    }
    
    /**
     * 
     * @param analise
     */
    private void linkFuncoesToAnalise(Analise analise) {
        linkAnaliseToFuncaoDados(analise);
        linkAnaliseToFuncaoTransacaos(analise);
    }

    /**
     * 
     * @param analise
     */
    private void linkAnaliseToFuncaoDados(Analise analise) {
        analise.getFuncaoDados().forEach(funcaoDados -> {
            funcaoDados.setAnalise(analise);
            linkFuncaoDadosRelationships(funcaoDados);
            handleVersionFuncaoDados(funcaoDados, analise.getSistema());
        });
    }

    /**
     * 
     * @param funcaoDados
     */
    private void linkFuncaoDadosRelationships(FuncaoDados funcaoDados) {
        funcaoDados.getFiles().forEach(file -> file.setFuncaoDados(funcaoDados));
        funcaoDados.getDers().forEach(der -> der.setFuncaoDados(funcaoDados));
        funcaoDados.getRlrs().forEach(rlr -> rlr.setFuncaoDados(funcaoDados));
    }

    /**
     * 
     * @param funcaoDados
     * @param sistema
     */
    private void handleVersionFuncaoDados(FuncaoDados funcaoDados, Sistema sistema) {
        String nome = funcaoDados.getName();
        Optional<FuncaoDadosVersionavel> funcaoDadosVersionavel = 
                funcaoDadosVersionavelRepository.findOneByNomeIgnoreCaseAndSistemaId(nome, sistema.getId());
        if (funcaoDadosVersionavel.isPresent()) {
            funcaoDados.setFuncaoDadosVersionavel(funcaoDadosVersionavel.get());
        } else {
            FuncaoDadosVersionavel novaFDVersionavel = new FuncaoDadosVersionavel();
            novaFDVersionavel.setNome(funcaoDados.getName());
            novaFDVersionavel.setSistema(sistema);
            FuncaoDadosVersionavel result = funcaoDadosVersionavelRepository.save(novaFDVersionavel);
            funcaoDados.setFuncaoDadosVersionavel(result);
        }
    }

    /**
     * 
     * @param analise
     */
    private void linkAnaliseToFuncaoTransacaos(Analise analise) {
        analise.getFuncaoTransacaos().forEach(funcaoTransacao -> {
            funcaoTransacao.setAnalise(analise);
            funcaoTransacao.getFiles().forEach(file -> file.setFuncaoTransacao(funcaoTransacao));
            funcaoTransacao.getDers().forEach(der -> der.setFuncaoTransacao(funcaoTransacao));
            funcaoTransacao.getAlrs().forEach(alr -> alr.setFuncaoTransacao(funcaoTransacao));
        });
    }

    /**
     * 
     * @param result
     */
    private void unlinkAnaliseFromFuncoes(Analise result) {
        result.getFuncaoDados().forEach(entry -> {
            entry.setAnalise(null);
        });
        result.getFuncaoTransacaos().forEach(entry -> {
            entry.setAnalise(null);
        });
    }

    /**
     * PUT /analises : Updates an existing analise.
     *
     * @param analise
     * the analise to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated
     * analise, or with status 400 (Bad Request) if the analise is not
     * valid, or with status 500 (Internal Server Error) if the analise
     * couldnt be updated
     * @throws URISyntaxException
     * if the Location URI syntax is incorrect
     */
    @PutMapping("/analises")
    @Timed
    public ResponseEntity<Analise> updateAnalise(@Valid @RequestBody Analise analise) throws URISyntaxException {
        log.debug("REST request to update Analise : {}", analise);
        if (analise.getId() == null) {
            return createAnalise(analise);
        }
        linkFuncoesToAnalise(analise);
        Analise result = analiseRepository.save(analise);
        unlinkAnaliseFromFuncoes(result);
        analiseSearchRepository.save(result);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, analise.getId().toString()))
                .body(result);
    }
    
    /**
     * GET /analises : get all the analises.
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of analises in body
     * @throws URISyntaxException
     * if there is an error to generate the pagination HTTP headers
     */
    @GetMapping("/analises")
    @Timed
    public ResponseEntity<List<Analise>> getAllAnalises(@ApiParam Pageable pageable) throws URISyntaxException {
        log.debug("REST request to get a page of Analises");
        Page<Analise> page = analiseRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/analises");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET /analises/:id : get the "id" analise.
     * @param id
     * the id of the analise to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the analise, or
     * with status 404 (Not Found)
     */
    @GetMapping("/analises/{id}")
    @Timed
    public ResponseEntity<Analise> getAnalise(@PathVariable Long id) {
        log.debug("REST request to get Analise : {}", id);
        Analise analise = recuperarAnalise(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(analise));
    }   

    /**
     * DELETE /analises/:id : delete the "id" analise.
     * @param id
     * the id of the analise to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/analises/{id}")
    @Timed
    public ResponseEntity<Void> deleteAnalise(@PathVariable Long id) {
        log.debug("REST request to delete Analise : {}", id);
        analiseRepository.delete(id);
        analiseSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH /_search/analises?query=:query : search for the analise corresponding to the query.
     * @param query
     * the query of the analise search
     * @param pageable
     * the pagination information
     * @return the result of the search
     * @throws URISyntaxException
     * if there is an error to generate the pagination HTTP headers
     */
    @GetMapping("/_search/analises")
    @Timed
    // TODO todos os endpoint elastic poderiam ter o defaultValue impacta na paginacao do frontend
    public ResponseEntity<List<Analise>> searchAnalises(@RequestParam(defaultValue = "*") String query,
            @ApiParam Pageable pageable) throws URISyntaxException {
        log.debug("REST request to search for a page of Analises for query {}", query);
        Page<Analise> page = analiseSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/analises");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }
    
    /**
     * Método responsável por requisitar a geração do relatório de Análise.
     * @param analise
     * @throws URISyntaxException
     * @throws JRException 
     * @throws IOException 
     */
    @GetMapping("/relatorioAnalise/{id}")
    @Timed
    public ResponseEntity<byte[]> gerarRelatorioAnalises(@PathVariable Long id) throws URISyntaxException, IOException, JRException {
        Analise analise = recuperarAnalise(id);
        relatorioAnaliseRest = new RelatorioAnaliseRest(this.response,this.request);
        log.debug("REST request to generate report Analise : {}", analise);
        return relatorioAnaliseRest.downloadAnalise(analise);
    }
    
    /**
     * Método responsável por requisitar a geração do relatório de Análise.
     * @param analise
     * @throws URISyntaxException
     * @throws JRException 
     * @throws IOException 
     */
    @GetMapping("/relatorios/{id}")
    @Timed
    public @ResponseBody byte[] gerarRelatorioAnalise(@PathVariable Long id) throws URISyntaxException, IOException, JRException {
        Analise analise = recuperarAnalise(id);
        relatorioAnaliseRest = new RelatorioAnaliseRest(this.response,this.request);
        log.debug("REST request to generate report Analise : {}", analise);
        return relatorioAnaliseRest.downloadAnalisePDF(analise);
    }
    
}
