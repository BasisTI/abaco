package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.Modulo;
import br.com.basis.abaco.repository.ModuloRepository;
import br.com.basis.abaco.repository.search.ModuloSearchRepository;
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
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * REST controller for managing Modulo.
 */
@RestController
@RequestMapping("/api")
public class ModuloResource {

    private final Logger log = LoggerFactory.getLogger(ModuloResource.class);

    private static final String ENTITY_NAME = "modulo";

    private final ModuloRepository moduloRepository;

    private final ModuloSearchRepository moduloSearchRepository;

    public ModuloResource(ModuloRepository moduloRepository, ModuloSearchRepository moduloSearchRepository) {
        this.moduloRepository = moduloRepository;
        this.moduloSearchRepository = moduloSearchRepository;
    }

    /**
     * POST  /modulos : Create a new modulo.
     *
     * @param modulo the modulo to create
     * @return the ResponseEntity with status 201 (Created) and with body the new modulo, or with status 400 (Bad Request) if the modulo has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/modulos")
    @Timed
    public ResponseEntity<Modulo> createModulo(@Valid @RequestBody Modulo modulo) throws URISyntaxException {
        log.debug("REST request to save Modulo : {}", modulo);
        if (modulo.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new modulo cannot already have an ID")).body(null);
        }
        Modulo result = moduloRepository.save(modulo);
        moduloSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/modulos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /modulos : Updates an existing modulo.
     *
     * @param modulo the modulo to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated modulo,
     * or with status 400 (Bad Request) if the modulo is not valid,
     * or with status 500 (Internal Server Error) if the modulo couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/modulos")
    @Timed
    public ResponseEntity<Modulo> updateModulo(@Valid @RequestBody Modulo modulo) throws URISyntaxException {
        log.debug("REST request to update Modulo : {}", modulo);
        if (modulo.getId() == null) {
            return createModulo(modulo);
        }
        Modulo result = moduloRepository.save(modulo);
        moduloSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, modulo.getId().toString()))
            .body(result);
    }

    /**
     * GET  /modulos : get all the modulos.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of modulos in body
     */
    @GetMapping("/modulos")
    @Timed
    public List<Modulo> getAllModulos() {
        log.debug("REST request to get all Modulos");
        List<Modulo> modulos = moduloRepository.findAll();
        return modulos;
    }

    /**
     * GET  /modulos/:id : get the "id" modulo.
     *
     * @param id the id of the modulo to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the modulo, or with status 404 (Not Found)
     */
    @GetMapping("/modulos/{id}")
    @Timed
    public ResponseEntity<Modulo> getModulo(@PathVariable Long id) {
        log.debug("REST request to get Modulo : {}", id);
        Modulo modulo = moduloRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(modulo));
    }

    /**
     * DELETE  /modulos/:id : delete the "id" modulo.
     *
     * @param id the id of the modulo to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/modulos/{id}")
    @Timed
    public ResponseEntity<Void> deleteModulo(@PathVariable Long id) {
        log.debug("REST request to delete Modulo : {}", id);
        moduloRepository.delete(id);
        moduloSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/modulos?query=:query : search for the modulo corresponding
     * to the query.
     *
     * @param query the query of the modulo search
     * @return the result of the search
     */
    @GetMapping("/_search/modulos")
    @Timed
    public List<Modulo> searchModulos(@RequestParam(defaultValue = "*") String query) {
        log.debug("REST request to search Modulos for query {}", query);
        return StreamSupport
            .stream(moduloSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }


}
