package br.com.basis.abaco.web.rest;

import com.codahale.metrics.annotation.Timed;
import br.com.basis.abaco.domain.TipoEquipe;

import br.com.basis.abaco.repository.TipoEquipeRepository;
import br.com.basis.abaco.repository.search.TipoEquipeSearchRepository;
import br.com.basis.abaco.web.rest.errors.BadRequestAlertException;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import br.com.basis.abaco.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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
 * REST controller for managing TipoEquipe.
 */
@RestController
@RequestMapping("/api")
public class TipoEquipeResource {

    private final Logger log = LoggerFactory.getLogger(TipoEquipeResource.class);

    private static final String ENTITY_NAME = "tipoEquipe";

    private final TipoEquipeRepository tipoEquipeRepository;

    private final TipoEquipeSearchRepository tipoEquipeSearchRepository;

    public TipoEquipeResource(TipoEquipeRepository tipoEquipeRepository, TipoEquipeSearchRepository tipoEquipeSearchRepository) {
        this.tipoEquipeRepository = tipoEquipeRepository;
        this.tipoEquipeSearchRepository = tipoEquipeSearchRepository;
    }

    /**
     * POST  /tipo-equipes : Create a new tipoEquipe.
     *
     * @param tipoEquipe the tipoEquipe to create
     * @return the ResponseEntity with status 201 (Created) and with body the new tipoEquipe, or with status 400 (Bad Request) if the tipoEquipe has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/tipo-equipes")
    @Timed
    public ResponseEntity<TipoEquipe> createTipoEquipe(@Valid @RequestBody TipoEquipe tipoEquipe) throws URISyntaxException {
        log.debug("REST request to save TipoEquipe : {}", tipoEquipe);
        if (tipoEquipe.getId() != null) {
            throw new BadRequestAlertException("A new tipoEquipe cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TipoEquipe result = tipoEquipeRepository.save(tipoEquipe);
        tipoEquipeSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/tipo-equipes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /tipo-equipes : Updates an existing tipoEquipe.
     *
     * @param tipoEquipe the tipoEquipe to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated tipoEquipe,
     * or with status 400 (Bad Request) if the tipoEquipe is not valid,
     * or with status 500 (Internal Server Error) if the tipoEquipe couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/tipo-equipes")
    @Timed
    public ResponseEntity<TipoEquipe> updateTipoEquipe(@Valid @RequestBody TipoEquipe tipoEquipe) throws URISyntaxException {
        log.debug("REST request to update TipoEquipe : {}", tipoEquipe);
        if (tipoEquipe.getId() == null) {
            return createTipoEquipe(tipoEquipe);
        }
        TipoEquipe result = tipoEquipeRepository.save(tipoEquipe);
        tipoEquipeSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, tipoEquipe.getId().toString()))
            .body(result);
    }

    /**
     * GET  /tipo-equipes : get all the tipoEquipes.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of tipoEquipes in body
     */
    @GetMapping("/tipo-equipes")
    @Timed
    public ResponseEntity<List<TipoEquipe>> getAllTipoEquipes(Pageable pageable) {
        log.debug("REST request to get a page of TipoEquipes");
        Page<TipoEquipe> page = tipoEquipeRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/tipo-equipes");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /tipo-equipes/:id : get the "id" tipoEquipe.
     *
     * @param id the id of the tipoEquipe to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the tipoEquipe, or with status 404 (Not Found)
     */
    @GetMapping("/tipo-equipes/{id}")
    @Timed
    public ResponseEntity<TipoEquipe> getTipoEquipe(@PathVariable Long id) {
        log.debug("REST request to get TipoEquipe : {}", id);
        TipoEquipe tipoEquipe = tipoEquipeRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(tipoEquipe));
    }

    /**
     * DELETE  /tipo-equipes/:id : delete the "id" tipoEquipe.
     *
     * @param id the id of the tipoEquipe to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/tipo-equipes/{id}")
    @Timed
    public ResponseEntity<Void> deleteTipoEquipe(@PathVariable Long id) {
        log.debug("REST request to delete TipoEquipe : {}", id);
        tipoEquipeRepository.delete(id);
        tipoEquipeSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/tipo-equipes?query=:query : search for the tipoEquipe corresponding
     * to the query.
     *
     * @param query the query of the tipoEquipe search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/tipo-equipes")
    @Timed
    public ResponseEntity<List<TipoEquipe>> searchTipoEquipes(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of TipoEquipes for query {}", query);
        Page<TipoEquipe> page = tipoEquipeSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/tipo-equipes");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
