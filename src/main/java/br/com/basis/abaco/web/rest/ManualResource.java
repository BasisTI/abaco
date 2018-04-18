package br.com.basis.abaco.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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

import com.codahale.metrics.annotation.Timed;

import br.com.basis.abaco.domain.Manual;
import br.com.basis.abaco.repository.ManualRepository;
import br.com.basis.abaco.repository.search.ManualSearchRepository;
import br.com.basis.abaco.utils.PageUtils;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import br.com.basis.abaco.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing Manual.
 */
@RestController
@RequestMapping("/api")
public class ManualResource {

    private final Logger log = LoggerFactory.getLogger(ManualResource.class);

    private static final String ENTITY_NAME = "manual";

    private final ManualRepository manualRepository;

    private final ManualSearchRepository manualSearchRepository;

    public ManualResource(ManualRepository manualRepository, ManualSearchRepository manualSearchRepository) {
        this.manualRepository = manualRepository;
        this.manualSearchRepository = manualSearchRepository;
    }

    /**
     * POST /manuals : Create a new manual.
     *
     * @param manual
     *            the manual to create
     * @return the ResponseEntity with status 201 (Created) and with body the new
     *         manual, or with status 400 (Bad Request) if the manual has already an
     *         ID
     * @throws URISyntaxException
     *             if the Location URI syntax is incorrect
     */
    @PostMapping("/manuals")
    @Timed
    public ResponseEntity<Manual> createManual(@Valid @RequestBody Manual manual) throws URISyntaxException {
        log.debug("REST request to save Manual : {}", manual);
        if (manual.getId() != null) {
            return ResponseEntity.badRequest().headers(
                    HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new manual cannot already have an ID"))
                    .body(null);
        }
        Manual linkedManual = linkManualToPhaseEffortsAndAdjustFactors(manual);
        Manual result = manualRepository.save(linkedManual);
        manualSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/manuals/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString())).body(result);
    }

    private Manual linkManualToPhaseEffortsAndAdjustFactors(Manual manual) {

        manual.getEsforcoFases().forEach(phaseEffort -> {
            phaseEffort.setManual(manual);
        });

        manual.getFatoresAjuste().forEach(adjustFactor -> {
            adjustFactor.setManual(manual);
        });

        return manual;
    }
    
    /**
     * PUT /manuals : Updates an existing manual.
     *
     * @param manual
     *            the manual to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated
     *         manual, or with status 400 (Bad Request) if the manual is not valid,
     *         or with status 500 (Internal Server Error) if the manual couldnt be
     *         updated
     * @throws URISyntaxException
     *             if the Location URI syntax is incorrect
     */
    @PutMapping("/manuals")
    @Timed
    public ResponseEntity<Manual> updateManual(@Valid @RequestBody Manual manual) throws URISyntaxException {
        log.debug("REST request to update Manual : {}", manual);
        if (manual.getId() == null) {
            return createManual(manual);
        }
        Manual result = manualRepository.save(manual);
        manualSearchRepository.save(result);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, manual.getId().toString()))
                .body(result);
    }

    /**
     * GET /manuals : get all the manuals.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of manuals in
     *         body
     */
    @GetMapping("/manuals")
    @Timed
    public List<Manual> getAllManuals() {
        log.debug("REST request to get all Manuals");
        List<Manual> manuals = manualRepository.findAll();
        return manuals;
    }

    /**
     * GET /manuals/:id : get the "id" manual.
     *
     * @param id
     *            the id of the manual to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the manual, or
     *         with status 404 (Not Found)
     */
    @GetMapping("/manuals/{id}")
    @Timed
    public ResponseEntity<Manual> getManual(@PathVariable Long id) {
        log.debug("REST request to get Manual : {}", id);
        Manual manual = manualRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(manual));
    }

    /**
     * DELETE /manuals/:id : delete the "id" manual.
     *
     * @param id
     *            the id of the manual to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/manuals/{id}")
    @Timed
    public ResponseEntity<Void> deleteManual(@PathVariable Long id) {
        log.debug("REST request to delete Manual : {}", id);
        manualRepository.delete(id);
        manualSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH /_search/manuals?query=:query : search for the manual corresponding to
     * the query.
     *
     * @param query
     *            the query of the manual search
     * @return the result of the search
     * @throws URISyntaxException 
     */
    @GetMapping("/_search/manuals")
    @Timed
    public ResponseEntity<List<Manual>> searchManuals(@RequestParam(defaultValue = "*") String query, @RequestParam String order, @RequestParam(name="page") int pageNumber, @RequestParam int size, @RequestParam(defaultValue="id") String sort) throws URISyntaxException {
        log.debug("REST request to search Manuals for query {}", query);
        Sort.Direction sortOrder = PageUtils.getSortDirection(order);
        
        Pageable newPageable = new PageRequest(pageNumber, size, sortOrder, sort);
        Page<Manual> page = manualSearchRepository.search(queryStringQuery(query), newPageable);
        
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/manuals");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }
    
    

}
