package br.com.basis.abaco.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;

import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.repository.AnaliseRepository;
import br.com.basis.abaco.repository.search.AnaliseSearchRepository;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import br.com.basis.abaco.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;

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

    public AnaliseResource(AnaliseRepository analiseRepository, AnaliseSearchRepository analiseSearchRepository) {
        this.analiseRepository = analiseRepository;
        this.analiseSearchRepository = analiseSearchRepository;
    }

    /**
     * POST /analises : Create a new analise.
     *
     * @param analise
     *            the analise to create
     * @return the ResponseEntity with status 201 (Created) and with body the new
     *         analise, or with status 400 (Bad Request) if the analise has already
     *         an ID
     * @throws URISyntaxException
     *             if the Location URI syntax is incorrect
     */
    @PostMapping("/analises")
    @Timed
    public ResponseEntity<Analise> createAnalise(@Valid @RequestBody Analise analise) throws URISyntaxException {
        log.debug("REST request to save Analise : {}", analise);
        if (analise.getId() != null) {
            return ResponseEntity.badRequest().headers(
                    HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new analise cannot already have an ID"))
                    .body(null);
        }
        linkFuncoesToAnalise(analise);
        Analise result = analiseRepository.save(analise);
        unlinkAnaliseFromFuncoes(result);
        analiseSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/analises/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString())).body(result);
    }

    private void linkFuncoesToAnalise(Analise analise) {
        linkAnaliseToFuncaoDados(analise);
        linkAnaliseToFuncaoTransacaos(analise);
    }

    private void linkAnaliseToFuncaoDados(Analise analise) {
        analise.getFuncaoDados().forEach(funcaoDados -> {
            funcaoDados.setAnalise(analise);
            funcaoDados.getFiles().forEach(file -> file.setFuncaoDados(funcaoDados));
            funcaoDados.getDers().forEach(der -> der.setFuncaoDados(funcaoDados));
        });
    }

    private void linkAnaliseToFuncaoTransacaos(Analise analise) {
        analise.getFuncaoTransacaos().forEach(funcaoTransacao -> {
            funcaoTransacao.setAnalise(analise);
            funcaoTransacao.getFiles().forEach(file -> file.setFuncaoTransacao(funcaoTransacao));
            funcaoTransacao.getDers().forEach(der -> der.setFuncaoTransacao(funcaoTransacao));
        });
    }

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
     *            the analise to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated
     *         analise, or with status 400 (Bad Request) if the analise is not
     *         valid, or with status 500 (Internal Server Error) if the analise
     *         couldnt be updated
     * @throws URISyntaxException
     *             if the Location URI syntax is incorrect
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
     *
     * @param pageable
     *            the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of analises in
     *         body
     * @throws URISyntaxException
     *             if there is an error to generate the pagination HTTP headers
     */
    @GetMapping("/analises")
    @Timed
    public ResponseEntity<List<Analise>> getAllAnalises(@ApiParam Pageable pageable) throws URISyntaxException {
        log.debug("REST request to get a page of Analises");

        Page<Analise> page = analiseRepository.findAll(pageable);

        // page.forEach(analise -> {
        // analise.getFuncaoDados().forEach(entry -> {
        // entry.setAnalise(null);

        // });
        // analise.getFuncaoTransacaos().forEach(entry -> {
        // entry.setAnalise(null);
        // });
        // });

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/analises");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET /analises/:id : get the "id" analise.
     *
     * @param id
     *            the id of the analise to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the analise, or
     *         with status 404 (Not Found)
     */
    @GetMapping("/analises/{id}")
    @Timed
    public ResponseEntity<Analise> getAnalise(@PathVariable Long id) {
        log.debug("REST request to get Analise : {}", id);
        Analise analise = analiseRepository.findOne(id);
        // analise.getFuncaoDados().forEach(entry -> {
        // entry.setAnalise(null);
        // });
        // analise.getFuncaoTransacaos().forEach(entry -> {
        // entry.setAnalise(null);
        // });
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(analise));
    }

    /**
     * DELETE /analises/:id : delete the "id" analise.
     *
     * @param id
     *            the id of the analise to delete
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
     * SEARCH /_search/analises?query=:query : search for the analise corresponding
     * to the query.
     *
     * @param query
     *            the query of the analise search
     * @param pageable
     *            the pagination information
     * @return the result of the search
     * @throws URISyntaxException
     *             if there is an error to generate the pagination HTTP headers
     */
    @GetMapping("/_search/analises")
    @Timed
    // TODO todos os endpoint elastic poderiam ter o defaultValue
    // impacta na paginacao do frontend
    public ResponseEntity<List<Analise>> searchAnalises(@RequestParam(defaultValue = "*") String query,
            @ApiParam Pageable pageable) throws URISyntaxException {
        log.debug("REST request to search for a page of Analises for query {}", query);
        Page<Analise> page = analiseSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/analises");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
