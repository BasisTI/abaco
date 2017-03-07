package br.com.basis.abaco.web.rest;

import com.codahale.metrics.annotation.Timed;
import br.com.basis.abaco.domain.Alr;

import br.com.basis.abaco.repository.AlrRepository;
import br.com.basis.abaco.repository.search.AlrSearchRepository;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Alr.
 */
@RestController
@RequestMapping("/api")
public class AlrResource {

    private final Logger log = LoggerFactory.getLogger(AlrResource.class);

    private static final String ENTITY_NAME = "alr";
        
    private final AlrRepository alrRepository;

    private final AlrSearchRepository alrSearchRepository;

    public AlrResource(AlrRepository alrRepository, AlrSearchRepository alrSearchRepository) {
        this.alrRepository = alrRepository;
        this.alrSearchRepository = alrSearchRepository;
    }

    /**
     * POST  /alrs : Create a new alr.
     *
     * @param alr the alr to create
     * @return the ResponseEntity with status 201 (Created) and with body the new alr, or with status 400 (Bad Request) if the alr has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/alrs")
    @Timed
    public ResponseEntity<Alr> createAlr(@RequestBody Alr alr) throws URISyntaxException {
        log.debug("REST request to save Alr : {}", alr);
        if (alr.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new alr cannot already have an ID")).body(null);
        }
        Alr result = alrRepository.save(alr);
        alrSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/alrs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /alrs : Updates an existing alr.
     *
     * @param alr the alr to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated alr,
     * or with status 400 (Bad Request) if the alr is not valid,
     * or with status 500 (Internal Server Error) if the alr couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/alrs")
    @Timed
    public ResponseEntity<Alr> updateAlr(@RequestBody Alr alr) throws URISyntaxException {
        log.debug("REST request to update Alr : {}", alr);
        if (alr.getId() == null) {
            return createAlr(alr);
        }
        Alr result = alrRepository.save(alr);
        alrSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, alr.getId().toString()))
            .body(result);
    }

    /**
     * GET  /alrs : get all the alrs.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of alrs in body
     */
    @GetMapping("/alrs")
    @Timed
    public List<Alr> getAllAlrs() {
        log.debug("REST request to get all Alrs");
        List<Alr> alrs = alrRepository.findAll();
        return alrs;
    }

    /**
     * GET  /alrs/:id : get the "id" alr.
     *
     * @param id the id of the alr to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the alr, or with status 404 (Not Found)
     */
    @GetMapping("/alrs/{id}")
    @Timed
    public ResponseEntity<Alr> getAlr(@PathVariable Long id) {
        log.debug("REST request to get Alr : {}", id);
        Alr alr = alrRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(alr));
    }

    /**
     * DELETE  /alrs/:id : delete the "id" alr.
     *
     * @param id the id of the alr to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/alrs/{id}")
    @Timed
    public ResponseEntity<Void> deleteAlr(@PathVariable Long id) {
        log.debug("REST request to delete Alr : {}", id);
        alrRepository.delete(id);
        alrSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/alrs?query=:query : search for the alr corresponding
     * to the query.
     *
     * @param query the query of the alr search 
     * @return the result of the search
     */
    @GetMapping("/_search/alrs")
    @Timed
    public List<Alr> searchAlrs(@RequestParam String query) {
        log.debug("REST request to search Alrs for query {}", query);
        return StreamSupport
            .stream(alrSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }


}
