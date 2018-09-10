package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.Rlr;
import br.com.basis.abaco.repository.RlrRepository;
import br.com.basis.abaco.repository.search.RlrSearchRepository;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import com.codahale.metrics.annotation.Timed;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
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
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * REST controller for managing Rlr.
 */
@RestController
@RequestMapping("/api")
public class RlrResource {

    private final Logger log = LoggerFactory.getLogger(RlrResource.class);

    private static final String ENTITY_NAME = "rlr";

    private final RlrRepository rlrRepository;

    private final RlrSearchRepository rlrSearchRepository;

    private final String ROLE_ADMIN_CONST = "ROLE_ADMIN";

    private final String ROLE_USER_CONST = "ROLE_USER";

    public RlrResource(RlrRepository rlrRepository, RlrSearchRepository rlrSearchRepository) {
        this.rlrRepository = rlrRepository;
        this.rlrSearchRepository = rlrSearchRepository;
    }

    /**
     * POST  /rlrs : Create a new rlr.
     *
     * @param rlr the rlr to create
     * @return the ResponseEntity with status 201 (Created) and with body the new rlr, or with status 400 (Bad Request) if the rlr has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/rlrs")
    @Timed
    @Secured({ROLE_ADMIN_CONST, ROLE_USER_CONST})
    public ResponseEntity<Rlr> createRlr(@Valid @RequestBody Rlr rlr) throws URISyntaxException {
        log.debug("REST request to save Rlr : {}", rlr);
        if (rlr.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new rlr cannot already have an ID")).body(null);
        }
        Rlr result = rlrRepository.save(rlr);
        rlrSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/rlrs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /rlrs : Updates an existing rlr.
     *
     * @param rlr the rlr to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated rlr,
     * or with status 400 (Bad Request) if the rlr is not valid,
     * or with status 500 (Internal Server Error) if the rlr couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/rlrs")
    @Timed
    @Secured({ROLE_ADMIN_CONST, ROLE_USER_CONST})
    public ResponseEntity<Rlr> updateRlr(@Valid @RequestBody Rlr rlr) throws URISyntaxException {
        log.debug("REST request to update Rlr : {}", rlr);
        if (rlr.getId() == null) {
            return createRlr(rlr);
        }
        Rlr result = rlrRepository.save(rlr);
        rlrSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, rlr.getId().toString()))
            .body(result);
    }

    /**
     * GET  /rlrs : get all the rlrs.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of rlrs in body
     */
    @GetMapping("/rlrs")
    @Timed
    public List<Rlr> getAllRlrs() {
        log.debug("REST request to get all Rlrs");
        List<Rlr> rlrs = rlrRepository.findAll();
        return rlrs;
    }

    /**
     * GET  /rlrs/:id : get the "id" rlr.
     *
     * @param id the id of the rlr to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the rlr, or with status 404 (Not Found)
     */
    @GetMapping("/rlrs/{id}")
    @Timed
    public ResponseEntity<Rlr> getRlr(@PathVariable Long id) {
        log.debug("REST request to get Rlr : {}", id);
        Rlr rlr = rlrRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(rlr));
    }

    /**
     * DELETE  /rlrs/:id : delete the "id" rlr.
     *
     * @param id the id of the rlr to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/rlrs/{id}")
    @Timed
    @Secured({ROLE_ADMIN_CONST, ROLE_USER_CONST})
    public ResponseEntity<Void> deleteRlr(@PathVariable Long id) {
        log.debug("REST request to delete Rlr : {}", id);
        rlrRepository.delete(id);
        rlrSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/rlrs?query=:query : search for the rlr corresponding
     * to the query.
     *
     * @param query the query of the rlr search
     * @return the result of the search
     */
    @GetMapping("/_search/rlrs")
    @Timed
    public List<Rlr> searchRlrs(@RequestParam String query) {
        log.debug("REST request to search Rlrs for query {}", query);
        return StreamSupport
            .stream(rlrSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }


}
