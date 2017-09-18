package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.domain.FuncaoDados;
import br.com.basis.abaco.domain.FuncaoTransacao;
import br.com.basis.abaco.repository.AnaliseRepository;
import br.com.basis.abaco.repository.search.AnaliseSearchRepository;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import com.codahale.metrics.annotation.Timed;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

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
     * POST  /analises : Create a new analise.
     *
     * @param analise the analise to create
     * @return the ResponseEntity with status 201 (Created) and with body the new analise, or with status 400 (Bad Request) if the analise has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/analises")
    @Timed
    public ResponseEntity<Analise> createAnalise(@Valid @RequestBody Analise analise) throws URISyntaxException {
        log.debug("REST request to save Analise : {}", analise);
        if (analise.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new analise cannot already have an ID")).body(null);
        }
        analise.getFuncaoDados().forEach(entry -> {
            entry.setAnalise(analise);
            entry.getFiles().forEach(file -> {
                file.setFuncaoDados(entry);
            });
        });
        analise.getFuncaoTransacaos().forEach(entry -> {
            entry.setAnalise(analise);
            entry.getFiles().forEach(file -> {
                file.setFuncaoTransacao(entry);
            });
        });
        Set<FuncaoDados> copyDados = new HashSet<>(analise.getFuncaoDados());
        Set<FuncaoTransacao> copyTransacao = new HashSet<>(analise.getFuncaoTransacaos());
        analise.setFuncaoDados(null);
        analise.setFuncaoTransacaos(null);
        Analise result = analiseRepository.save(analise);
        result.setFuncaoDados(copyDados);
        result.setFuncaoTransacaos(copyTransacao);
        result = analiseRepository.save(result);
        result.getFuncaoDados().forEach(entry -> {
            entry.setAnalise(null);
        });
        result.getFuncaoTransacaos().forEach(entry -> {
            entry.setAnalise(null);
        });
        analiseSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/analises/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /analises : Updates an existing analise.
     *
     * @param analise the analise to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated analise,
     * or with status 400 (Bad Request) if the analise is not valid,
     * or with status 500 (Internal Server Error) if the analise couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/analises")
    @Timed
    public ResponseEntity<Analise> updateAnalise(@Valid @RequestBody Analise analise) throws URISyntaxException {
        log.debug("REST request to update Analise : {}", analise);
        if (analise.getId() == null) {
            return createAnalise(analise);
        }
        analise.getFuncaoDados().forEach(entry -> {
            entry.setAnalise(analise);
            entry.getFiles().forEach(file -> {
                file.setFuncaoDados(entry);
            });
        });
        analise.getFuncaoTransacaos().forEach(entry -> {
            entry.setAnalise(analise);
            entry.getFiles().forEach(file -> {
                file.setFuncaoTransacao(entry);
            });
        });
        Analise result = analiseRepository.save(analise);
        result.getFuncaoDados().forEach(entry -> {
            entry.setAnalise(null);
        });
        result.getFuncaoTransacaos().forEach(entry -> {
            entry.setAnalise(null);
        });
        analiseSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, analise.getId().toString()))
            .body(result);
    }

    /**
     * GET  /analises : get all the analises.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of analises in body
     */
    @GetMapping("/analises")
    @Timed
    public List<Analise> getAllAnalises() {
        log.debug("REST request to get all Analises");
        List<Analise> analises = analiseRepository.findAll();
        analises.forEach(analise -> {
            analise.getFuncaoDados().forEach(entry -> {
                entry.setAnalise(null);

            });
            analise.getFuncaoTransacaos().forEach(entry -> {
                entry.setAnalise(null);
            });
        });
        return analises;
    }

    /**
     * GET  /analises/:id : get the "id" analise.
     *
     * @param id the id of the analise to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the analise, or with status 404 (Not Found)
     */
    @GetMapping("/analises/{id}")
    @Timed
    public ResponseEntity<Analise> getAnalise(@PathVariable Long id) {
        log.debug("REST request to get Analise : {}", id);
        Analise analise = analiseRepository.findOne(id);
        analise.getFuncaoDados().forEach(entry -> {
            entry.setAnalise(null);
        });
        analise.getFuncaoTransacaos().forEach(entry -> {
            entry.setAnalise(null);
        });
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(analise));
    }

    /**
     * DELETE  /analises/:id : delete the "id" analise.
     *
     * @param id the id of the analise to delete
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
     * SEARCH  /_search/analises?query=:query : search for the analise corresponding
     * to the query.
     *
     * @param query the query of the analise search
     * @return the result of the search
     */
    @GetMapping("/_search/analises")
    @Timed
    public List<Analise> searchAnalises(@RequestParam String query) {
        log.debug("REST request to search Analises for query {}", query);
        return StreamSupport
            .stream(analiseSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }


}
