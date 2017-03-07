package br.com.basis.abaco.web.rest;

import com.codahale.metrics.annotation.Timed;
import br.com.basis.abaco.domain.FatorAjuste;

import br.com.basis.abaco.repository.FatorAjusteRepository;
import br.com.basis.abaco.repository.search.FatorAjusteSearchRepository;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing FatorAjuste.
 */
@RestController
@RequestMapping("/api")
public class FatorAjusteResource {

    private final Logger log = LoggerFactory.getLogger(FatorAjusteResource.class);

    private static final String ENTITY_NAME = "fatorAjuste";
        
    private final FatorAjusteRepository fatorAjusteRepository;

    private final FatorAjusteSearchRepository fatorAjusteSearchRepository;

    public FatorAjusteResource(FatorAjusteRepository fatorAjusteRepository, FatorAjusteSearchRepository fatorAjusteSearchRepository) {
        this.fatorAjusteRepository = fatorAjusteRepository;
        this.fatorAjusteSearchRepository = fatorAjusteSearchRepository;
    }

    /**
     * POST  /fator-ajustes : Create a new fatorAjuste.
     *
     * @param fatorAjuste the fatorAjuste to create
     * @return the ResponseEntity with status 201 (Created) and with body the new fatorAjuste, or with status 400 (Bad Request) if the fatorAjuste has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/fator-ajustes")
    @Timed
    public ResponseEntity<FatorAjuste> createFatorAjuste(@Valid @RequestBody FatorAjuste fatorAjuste) throws URISyntaxException {
        log.debug("REST request to save FatorAjuste : {}", fatorAjuste);
        if (fatorAjuste.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new fatorAjuste cannot already have an ID")).body(null);
        }
        FatorAjuste result = fatorAjusteRepository.save(fatorAjuste);
        fatorAjusteSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/fator-ajustes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /fator-ajustes : Updates an existing fatorAjuste.
     *
     * @param fatorAjuste the fatorAjuste to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated fatorAjuste,
     * or with status 400 (Bad Request) if the fatorAjuste is not valid,
     * or with status 500 (Internal Server Error) if the fatorAjuste couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/fator-ajustes")
    @Timed
    public ResponseEntity<FatorAjuste> updateFatorAjuste(@Valid @RequestBody FatorAjuste fatorAjuste) throws URISyntaxException {
        log.debug("REST request to update FatorAjuste : {}", fatorAjuste);
        if (fatorAjuste.getId() == null) {
            return createFatorAjuste(fatorAjuste);
        }
        FatorAjuste result = fatorAjusteRepository.save(fatorAjuste);
        fatorAjusteSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, fatorAjuste.getId().toString()))
            .body(result);
    }

    /**
     * GET  /fator-ajustes : get all the fatorAjustes.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of fatorAjustes in body
     */
    @GetMapping("/fator-ajustes")
    @Timed
    public List<FatorAjuste> getAllFatorAjustes() {
        log.debug("REST request to get all FatorAjustes");
        List<FatorAjuste> fatorAjustes = fatorAjusteRepository.findAll();
        return fatorAjustes;
    }

    /**
     * GET  /fator-ajustes/:id : get the "id" fatorAjuste.
     *
     * @param id the id of the fatorAjuste to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the fatorAjuste, or with status 404 (Not Found)
     */
    @GetMapping("/fator-ajustes/{id}")
    @Timed
    public ResponseEntity<FatorAjuste> getFatorAjuste(@PathVariable Long id) {
        log.debug("REST request to get FatorAjuste : {}", id);
        FatorAjuste fatorAjuste = fatorAjusteRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(fatorAjuste));
    }

    /**
     * DELETE  /fator-ajustes/:id : delete the "id" fatorAjuste.
     *
     * @param id the id of the fatorAjuste to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/fator-ajustes/{id}")
    @Timed
    public ResponseEntity<Void> deleteFatorAjuste(@PathVariable Long id) {
        log.debug("REST request to delete FatorAjuste : {}", id);
        fatorAjusteRepository.delete(id);
        fatorAjusteSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/fator-ajustes?query=:query : search for the fatorAjuste corresponding
     * to the query.
     *
     * @param query the query of the fatorAjuste search 
     * @return the result of the search
     */
    @GetMapping("/_search/fator-ajustes")
    @Timed
    public List<FatorAjuste> searchFatorAjustes(@RequestParam String query) {
        log.debug("REST request to search FatorAjustes for query {}", query);
        return StreamSupport
            .stream(fatorAjusteSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }


}
