package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.Contrato;
import br.com.basis.abaco.domain.Organizacao;
import br.com.basis.abaco.repository.ContratoRepository;
import br.com.basis.abaco.repository.search.ContratoSearchRepository;
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
 * REST controller for managing Contrato.
 */
@RestController
@RequestMapping("/api")
public class ContratoResource {

    private final Logger log = LoggerFactory.getLogger(ContratoResource.class);

    private static final String ENTITY_NAME = "contrato";

    private final ContratoRepository contratoRepository;

    private final ContratoSearchRepository contratoSearchRepository;

    public ContratoResource(ContratoRepository contratoRepository, ContratoSearchRepository contratoSearchRepository) {
        this.contratoRepository = contratoRepository;
        this.contratoSearchRepository = contratoSearchRepository;
    }

    /**
     * Function to format a bad request URL to be returned to frontend
     * @param errorKey The key identifing the error occured
     * @param defaultMessage Default message to display to user
     * @return The bad request URL
     */
    private ResponseEntity<Contrato> createBadRequest(String errorKey, String defaultMessage) {
        return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, errorKey, defaultMessage))
            .body(null);
    }

    /**
     * POST  /contratoes : Create a new contrato.
     *
     * @param contrato the contrato to create
     * @return the ResponseEntity with status 201 (Created) and with body the new contrato, or with status 400 (Bad Request) if the contrato has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/contratoes")
    @Timed
    public ResponseEntity<Contrato> createContrato(@RequestBody Contrato contrato) throws URISyntaxException {
        log.debug("REST request to save Contrato : {}", contrato);
        if (contrato.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new contrato cannot already have an ID")).body(null);
        }

        /* Verifing field "Inicio Vigência" and "Final Vigência" */
        if (contrato.getDataInicioVigencia().isAfter(contrato.getDataFimVigencia())){
            return this.createBadRequest("beggindateGTenddate", "Filed \"Início Vigência\" is after \"Final Vigência\"");
        }

        Contrato result = contratoRepository.save(contrato);
        contratoSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/contratoes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /contratoes : Updates an existing contrato.
     *
     * @param contrato the contrato to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated contrato,
     * or with status 400 (Bad Request) if the contrato is not valid,
     * or with status 500 (Internal Server Error) if the contrato couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/contratoes")
    @Timed
    public ResponseEntity<Contrato> updateContrato(@RequestBody Contrato contrato) throws URISyntaxException {
        log.debug("REST request to update Contrato : {}", contrato);
        if (contrato.getId() == null) {
            return createContrato(contrato);
        }
        Contrato result = contratoRepository.save(contrato);
        contratoSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, contrato.getId().toString()))
            .body(result);
    }


    /**
     * POST  /contratoes/organizations : get all the contratoes by organization.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of contratoes in body
     */
    @PostMapping("/contratoes/organizations")
    @Timed
    public List<Contrato> getAllContratoesByOrganization(@RequestBody Organizacao organizacao) {
        log.debug("REST request to get all Contratoes");
        List<Contrato> contratoes = contratoRepository.findAllByOrganization(organizacao);
        return contratoes;
    }


    /**
     * GET  /contratoes : get all the contratoes.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of contratoes in body
     */
    @GetMapping("/contratoes")
    @Timed
    public List<Contrato> getAllContratoes() {
        log.debug("REST request to get all Contratoes");
        List<Contrato> contratoes = contratoRepository.findAll();
        return contratoes;
    }

    /**
     * GET  /contratoes/:id : get the "id" contrato.
     *
     * @param id the id of the contrato to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the contrato, or with status 404 (Not Found)
     */
    @GetMapping("/contratoes/{id}")
    @Timed
    public ResponseEntity<Contrato> getContrato(@PathVariable Long id) {
        log.debug("REST request to get Contrato : {}", id);
        Contrato contrato = contratoRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(contrato));
    }

    /**
     * DELETE  /contratoes/:id : delete the "id" contrato.
     *
     * @param id the id of the contrato to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/contratoes/{id}")
    @Timed
    public ResponseEntity<Void> deleteContrato(@PathVariable Long id) {
        log.debug("REST request to delete Contrato : {}", id);
        contratoRepository.delete(id);
        contratoSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/contratoes?query=:query : search for the contrato corresponding
     * to the query.
     *
     * @param query the query of the contrato search
     * @return the result of the search
     */
    @GetMapping("/_search/contratoes")
    @Timed
    public List<Contrato> searchContratoes(@RequestParam(defaultValue = "*") String query) {
        log.debug("REST request to search Contratoes for query {}", query);
        return StreamSupport
            .stream(contratoSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }


}
