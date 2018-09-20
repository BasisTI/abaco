package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.Der;
import br.com.basis.abaco.repository.DerRepository;
import br.com.basis.abaco.repository.search.DerSearchRepository;
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
 * REST controller for managing Der.
 */
@RestController
@RequestMapping("/api")
public class DerResource {

    private final Logger log = LoggerFactory.getLogger(DerResource.class);

    private static final String ENTITY_NAME = "der";

    private final DerRepository derRepository;

    private final DerSearchRepository derSearchRepository;

    public DerResource(DerRepository derRepository, DerSearchRepository derSearchRepository) {
        this.derRepository = derRepository;
        this.derSearchRepository = derSearchRepository;
    }

    /**
     * POST  /ders : Create a new der.
     *
     * @param der the der to create
     * @return the ResponseEntity with status 201 (Created) and with body the new der, or with status 400 (Bad Request) if the der has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/ders")
    @Timed
    @Secured({"ROLE_ADMIN", "ROLE_USER", "ROLE_GESTOR"})
    public ResponseEntity<Der> createDer(@Valid @RequestBody Der der) throws URISyntaxException {
        log.debug("REST request to save Der : {}", der);
        if (der.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new der cannot already have an ID")).body(null);
        }
        Der result = derRepository.save(der);
        derSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/ders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /ders : Updates an existing der.
     *
     * @param der the der to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated der,
     * or with status 400 (Bad Request) if the der is not valid,
     * or with status 500 (Internal Server Error) if the der couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/ders")
    @Timed
    @Secured({"ROLE_ADMIN", "ROLE_USER", "ROLE_GESTOR"})
    public ResponseEntity<Der> updateDer(@Valid @RequestBody Der der) throws URISyntaxException {
        log.debug("REST request to update Der : {}", der);
        if (der.getId() == null) {
            return createDer(der);
        }
        Der result = derRepository.save(der);
        derSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, der.getId().toString()))
            .body(result);
    }

    /**
     * GET  /ders : get all the ders.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of ders in body
     */
    @GetMapping("/ders")
    @Timed
    public List<Der> getAllDers() {
        log.debug("REST request to get all Ders");
        List<Der> ders = derRepository.findAll();
        return ders;
    }

    /**
     * GET  /ders/:id : get the "id" der.
     *
     * @param id the id of the der to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the der, or with status 404 (Not Found)
     */
    @GetMapping("/ders/{id}")
    @Timed
    public ResponseEntity<Der> getDer(@PathVariable Long id) {
        log.debug("REST request to get Der : {}", id);
        Der der = derRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(der));
    }

    /**
     * DELETE  /ders/:id : delete the "id" der.
     *
     * @param id the id of the der to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/ders/{id}")
    @Timed
    @Secured({"ROLE_ADMIN", "ROLE_USER", "ROLE_GESTOR"})
    public ResponseEntity<Void> deleteDer(@PathVariable Long id) {
        log.debug("REST request to delete Der : {}", id);
        derRepository.delete(id);
        derSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/ders?query=:query : search for the der corresponding
     * to the query.
     *
     * @param query the query of the der search
     * @return the result of the search
     */
    @GetMapping("/_search/ders")
    @Timed
    public List<Der> searchDers(@RequestParam(defaultValue = "*") String query) {
        log.debug("REST request to search Ders for query {}", query);
        return StreamSupport
            .stream(derSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }


}
