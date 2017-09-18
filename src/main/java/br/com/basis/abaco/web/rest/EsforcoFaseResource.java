package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.EsforcoFase;
import br.com.basis.abaco.repository.EsforcoFaseRepository;
import br.com.basis.abaco.repository.search.EsforcoFaseSearchRepository;
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

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * REST controller for managing EsforcoFase.
 */
@RestController
@RequestMapping("/api")
public class EsforcoFaseResource {

    private final Logger log = LoggerFactory.getLogger(EsforcoFaseResource.class);

    private static final String ENTITY_NAME = "esforcoFase";

    private final EsforcoFaseRepository esforcoFaseRepository;

    private final EsforcoFaseSearchRepository esforcoFaseSearchRepository;

    public EsforcoFaseResource(EsforcoFaseRepository esforcoFaseRepository, EsforcoFaseSearchRepository esforcoFaseSearchRepository) {
        this.esforcoFaseRepository = esforcoFaseRepository;
        this.esforcoFaseSearchRepository = esforcoFaseSearchRepository;
    }

    /**
     * POST  /esforco-fases : Create a new esforcoFase.
     *
     * @param esforcoFase the esforcoFase to create
     * @return the ResponseEntity with status 201 (Created) and with body the new esforcoFase, or with status 400 (Bad Request) if the esforcoFase has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/esforco-fases")
    @Timed
    public ResponseEntity<EsforcoFase> createEsforcoFase(@RequestBody EsforcoFase esforcoFase) throws URISyntaxException {
        log.debug("REST request to save EsforcoFase : {}", esforcoFase);
        if (esforcoFase.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new esforcoFase cannot already have an ID")).body(null);
        }
        EsforcoFase result = esforcoFaseRepository.save(esforcoFase);
        esforcoFaseSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/esforco-fases/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /esforco-fases : Updates an existing esforcoFase.
     *
     * @param esforcoFase the esforcoFase to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated esforcoFase,
     * or with status 400 (Bad Request) if the esforcoFase is not valid,
     * or with status 500 (Internal Server Error) if the esforcoFase couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/esforco-fases")
    @Timed
    public ResponseEntity<EsforcoFase> updateEsforcoFase(@RequestBody EsforcoFase esforcoFase) throws URISyntaxException {
        log.debug("REST request to update EsforcoFase : {}", esforcoFase);
        if (esforcoFase.getId() == null) {
            return createEsforcoFase(esforcoFase);
        }
        EsforcoFase result = esforcoFaseRepository.save(esforcoFase);
        esforcoFaseSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, esforcoFase.getId().toString()))
            .body(result);
    }

    /**
     * GET  /esforco-fases : get all the esforcoFases.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of esforcoFases in body
     */
    @GetMapping("/esforco-fases")
    @Timed
    public List<EsforcoFase> getAllEsforcoFases() {
        log.debug("REST request to get all EsforcoFases");
        List<EsforcoFase> esforcoFases = esforcoFaseRepository.findAll();
        return esforcoFases;
    }

    /**
     * GET  /esforco-fases/:id : get the "id" esforcoFase.
     *
     * @param id the id of the esforcoFase to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the esforcoFase, or with status 404 (Not Found)
     */
    @GetMapping("/esforco-fases/{id}")
    @Timed
    public ResponseEntity<EsforcoFase> getEsforcoFase(@PathVariable Long id) {
        log.debug("REST request to get EsforcoFase : {}", id);
        EsforcoFase esforcoFase = esforcoFaseRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(esforcoFase));
    }

    /**
     * DELETE  /esforco-fases/:id : delete the "id" esforcoFase.
     *
     * @param id the id of the esforcoFase to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/esforco-fases/{id}")
    @Timed
    public ResponseEntity<Void> deleteEsforcoFase(@PathVariable Long id) {
        log.debug("REST request to delete EsforcoFase : {}", id);
        esforcoFaseRepository.delete(id);
        esforcoFaseSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/esforco-fases?query=:query : search for the esforcoFase corresponding
     * to the query.
     *
     * @param query the query of the esforcoFase search
     * @return the result of the search
     */
    @GetMapping("/_search/esforco-fases")
    @Timed
    public List<EsforcoFase> searchEsforcoFases(@RequestParam String query) {
        log.debug("REST request to search EsforcoFases for query {}", query);
        return StreamSupport
            .stream(esforcoFaseSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }


}
