package br.com.basis.abaco.web.rest;

import com.codahale.metrics.annotation.Timed;
import br.com.basis.abaco.domain.Sistema;

import br.com.basis.abaco.repository.SistemaRepository;
import br.com.basis.abaco.repository.search.SistemaSearchRepository;
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
 * REST controller for managing Sistema.
 */
@RestController
@RequestMapping("/api")
public class SistemaResource {

    private final Logger log = LoggerFactory.getLogger(SistemaResource.class);

    private static final String ENTITY_NAME = "sistema";
        
    private final SistemaRepository sistemaRepository;

    private final SistemaSearchRepository sistemaSearchRepository;

    public SistemaResource(SistemaRepository sistemaRepository, SistemaSearchRepository sistemaSearchRepository) {
        this.sistemaRepository = sistemaRepository;
        this.sistemaSearchRepository = sistemaSearchRepository;
    }

    /**
     * POST  /sistemas : Create a new sistema.
     *
     * @param sistema the sistema to create
     * @return the ResponseEntity with status 201 (Created) and with body the new sistema, or with status 400 (Bad Request) if the sistema has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/sistemas")
    @Timed
    public ResponseEntity<Sistema> createSistema(@Valid @RequestBody Sistema sistema) throws URISyntaxException {
        log.debug("REST request to save Sistema : {}", sistema);
        if (sistema.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new sistema cannot already have an ID")).body(null);
        }
        Sistema result = sistemaRepository.save(sistema);
        sistemaSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/sistemas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /sistemas : Updates an existing sistema.
     *
     * @param sistema the sistema to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated sistema,
     * or with status 400 (Bad Request) if the sistema is not valid,
     * or with status 500 (Internal Server Error) if the sistema couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/sistemas")
    @Timed
    public ResponseEntity<Sistema> updateSistema(@Valid @RequestBody Sistema sistema) throws URISyntaxException {
        log.debug("REST request to update Sistema : {}", sistema);
        if (sistema.getId() == null) {
            return createSistema(sistema);
        }
        Sistema result = sistemaRepository.save(sistema);
        sistemaSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, sistema.getId().toString()))
            .body(result);
    }

    /**
     * GET  /sistemas : get all the sistemas.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of sistemas in body
     */
    @GetMapping("/sistemas")
    @Timed
    public List<Sistema> getAllSistemas() {
        log.debug("REST request to get all Sistemas");
        List<Sistema> sistemas = sistemaRepository.findAll();
        return sistemas;
    }

    /**
     * GET  /sistemas/:id : get the "id" sistema.
     *
     * @param id the id of the sistema to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the sistema, or with status 404 (Not Found)
     */
    @GetMapping("/sistemas/{id}")
    @Timed
    public ResponseEntity<Sistema> getSistema(@PathVariable Long id) {
        log.debug("REST request to get Sistema : {}", id);
        Sistema sistema = sistemaRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(sistema));
    }

    /**
     * DELETE  /sistemas/:id : delete the "id" sistema.
     *
     * @param id the id of the sistema to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/sistemas/{id}")
    @Timed
    public ResponseEntity<Void> deleteSistema(@PathVariable Long id) {
        log.debug("REST request to delete Sistema : {}", id);
        sistemaRepository.delete(id);
        sistemaSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/sistemas?query=:query : search for the sistema corresponding
     * to the query.
     *
     * @param query the query of the sistema search 
     * @return the result of the search
     */
    @GetMapping("/_search/sistemas")
    @Timed
    public List<Sistema> searchSistemas(@RequestParam String query) {
        log.debug("REST request to search Sistemas for query {}", query);
        return StreamSupport
            .stream(sistemaSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }


}
