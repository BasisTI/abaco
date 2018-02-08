package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.Fase;
import br.com.basis.abaco.repository.FaseRepository;
import br.com.basis.abaco.repository.search.FaseSearchRepository;
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
 * REST controller for managing Fase.
 */
@RestController
@RequestMapping("/api")
public class FaseResource {

    private final Logger log = LoggerFactory.getLogger(FaseResource.class);

    private static final String ENTITY_NAME = "fase";

    private final FaseRepository faseRepository;

    private final FaseSearchRepository faseSearchRepository;

    public FaseResource(FaseRepository faseRepository, FaseSearchRepository faseSearchRepository) {
        this.faseRepository = faseRepository;
        this.faseSearchRepository = faseSearchRepository;
    }

    /**
     * POST  /fases : Create a new fase.
     *
     * @param fase the fase to create
     * @return the ResponseEntity with status 201 (Created) and with body the new fase, or with status 400 (Bad Request) if the fase has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/fases")
    @Timed
    public ResponseEntity<Fase> createFase(@RequestBody Fase fase) throws URISyntaxException {
        log.debug("REST request to save Fase : {}", fase);
        if (fase.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new fase cannot already have an ID")).body(null);
        }
        Fase result = faseRepository.save(fase);
        faseSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/fases/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /fases : Updates an existing fase.
     *
     * @param fase the fase to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated fase,
     * or with status 400 (Bad Request) if the fase is not valid,
     * or with status 500 (Internal Server Error) if the fase couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/fases")
    @Timed
    public ResponseEntity<Fase> updateFase(@RequestBody Fase fase) throws URISyntaxException {
        log.debug("REST request to update Fase : {}", fase);
        if (fase.getId() == null) {
            return createFase(fase);
        }
        Fase result = faseRepository.save(fase);
        faseSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, fase.getId().toString()))
            .body(result);
    }

    /**
     * GET  /fases : get all the fases.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of fases in body
     */
    @GetMapping("/fases")
    @Timed
    public List<Fase> getAllFases() {
        log.debug("REST request to get all Fases");
        List<Fase> fases = faseRepository.findAll();
        return fases;
    }

    /**
     * GET  /fases/:id : get the "id" fase.
     *
     * @param id the id of the fase to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the fase, or with status 404 (Not Found)
     */
    @GetMapping("/fases/{id}")
    @Timed
    public ResponseEntity<Fase> getFase(@PathVariable Long id) {
        log.debug("REST request to get Fase : {}", id);
        Fase fase = faseRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(fase));
    }

    /**
     * DELETE  /fases/:id : delete the "id" fase.
     *
     * @param id the id of the fase to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/fases/{id}")
    @Timed
    public ResponseEntity<Void> deleteFase(@PathVariable Long id) {
        log.debug("REST request to delete Fase : {}", id);
        faseRepository.delete(id);
        faseSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/fases?query=:query : search for the fase corresponding
     * to the query.
     *
     * @param query the query of the fase search
     * @return the result of the search
     */
    @GetMapping("/_search/fases")
    @Timed
    public List<Fase> searchFases(@RequestParam(defaultValue = "*") String query) {
        log.debug("REST request to search Fases for query {}", query);
        return StreamSupport
            .stream(faseSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }


}
