package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.Funcionalidade;
import br.com.basis.abaco.repository.FuncionalidadeRepository;
import br.com.basis.abaco.repository.search.FuncionalidadeSearchRepository;
import br.com.basis.abaco.service.FuncionalidadeService;
import br.com.basis.abaco.service.dto.DropdownDTO;
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

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Funcionalidade.
 */
@RestController
@RequestMapping("/api")
public class FuncionalidadeResource {

    private final Logger log = LoggerFactory.getLogger(FuncionalidadeResource.class);

    private static final String ENTITY_NAME = "funcionalidade";

    private final FuncionalidadeRepository funcionalidadeRepository;

    private final FuncionalidadeSearchRepository funcionalidadeSearchRepository;

    private FuncionalidadeService funcionalidadeService;

    private static final String ROLE_ANALISTA = "ROLE_ANALISTA";

    private static final String ROLE_ADMIN = "ROLE_ADMIN";

    private static final String ROLE_USER = "ROLE_USER";

    private static final String ROLE_GESTOR = "ROLE_GESTOR";

    public FuncionalidadeResource(FuncionalidadeRepository funcionalidadeRepository,
            FuncionalidadeSearchRepository funcionalidadeSearchRepository,
            FuncionalidadeService funcionalidadeService) {
        this.funcionalidadeRepository = funcionalidadeRepository;
        this.funcionalidadeSearchRepository = funcionalidadeSearchRepository;
        this.funcionalidadeService = funcionalidadeService;
    }

    /**
     * POST  /funcionalidades : Create a new funcionalidade.
     *
     * @param funcionalidade the funcionalidade to create
     * @return the ResponseEntity with status 201 (Created) and with body the new funcionalidade, or with status 400 (Bad Request) if the funcionalidade has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/funcionalidades")
    @Timed
    @Secured({ROLE_ADMIN, ROLE_USER, ROLE_GESTOR, ROLE_ANALISTA})
    public ResponseEntity<Funcionalidade> createFuncionalidade(@Valid @RequestBody Funcionalidade funcionalidade) throws URISyntaxException {
        log.debug("REST request to save Funcionalidade : {}", funcionalidade);
        if (funcionalidade.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new funcionalidade cannot already have an ID")).body(null);
        }
        Funcionalidade result = funcionalidadeRepository.save(funcionalidade);
        funcionalidadeSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/funcionalidades/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /funcionalidades : Updates an existing funcionalidade.
     *
     * @param funcionalidade the funcionalidade to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated funcionalidade,
     * or with status 400 (Bad Request) if the funcionalidade is not valid,
     * or with status 500 (Internal Server Error) if the funcionalidade couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/funcionalidades")
    @Timed
    @Secured({ROLE_ADMIN, ROLE_USER, ROLE_GESTOR, ROLE_ANALISTA})
    public ResponseEntity<Funcionalidade> updateFuncionalidade(@Valid @RequestBody Funcionalidade funcionalidade) throws URISyntaxException {
        log.debug("REST request to update Funcionalidade : {}", funcionalidade);
        if (funcionalidade.getId() == null) {
            return createFuncionalidade(funcionalidade);
        }
        Funcionalidade result = funcionalidadeRepository.save(funcionalidade);
        funcionalidadeSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, funcionalidade.getId().toString()))
            .body(result);
    }

    /**
     * GET  /funcionalidades : get all the funcionalidades.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of funcionalidades in body
     */
    @GetMapping("/funcionalidades")
    @Timed
    public List<Funcionalidade> getAllFuncionalidades() {
        log.debug("REST request to get all Funcionalidades");
        return funcionalidadeRepository.findAll();
    }

    /**
     * GET  /funcionalidades/:id : get the "id" funcionalidade.
     *
     * @param id the id of the funcionalidade to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the funcionalidade, or with status 404 (Not Found)
     */
    @GetMapping("/funcionalidades/{id}")
    @Timed
    public ResponseEntity<Funcionalidade> getFuncionalidade(@PathVariable Long id) {
        log.debug("REST request to get Funcionalidade : {}", id);
        Funcionalidade funcionalidade = funcionalidadeRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(funcionalidade));
    }

    /**
     * DELETE  /funcionalidades/:id : delete the "id" funcionalidade.
     *
     * @param id the id of the funcionalidade to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/funcionalidades/{id}")
    @Timed
    @Secured({ROLE_ADMIN, ROLE_USER, ROLE_GESTOR, ROLE_ANALISTA})
    public ResponseEntity<Void> deleteFuncionalidade(@PathVariable Long id) {
        log.debug("REST request to delete Funcionalidade : {}", id);
        funcionalidadeRepository.delete(id);
        funcionalidadeSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/funcionalidades?query=:query : search for the funcionalidade corresponding
     * to the query.
     *
     * @param query the query of the funcionalidade search
     * @return the result of the search
     */
    @GetMapping("/_search/funcionalidades")
    @Timed
    public List<Funcionalidade> searchFuncionalidades(@RequestParam(defaultValue = "*") String query) {
        log.debug("REST request to search Funcionalidades for query {}", query);
        return StreamSupport
            .stream(funcionalidadeSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

    @GetMapping("/funcionalidades/drop-down/{idModulo}")
    @Timed
    public List<DropdownDTO> findDropdownByModuloId(@PathVariable Long idModulo) {
        log.debug("REST request to get dropdown Funcionalidades for Modulo {}", idModulo);
        return funcionalidadeService.findDropdownByModuloId(idModulo);
    }

    @GetMapping("/funcionalidades/total-functions/{id}")
    @Timed
    public Long countTotaFuncao(@PathVariable Long id){
        log.debug("REST request to get total Funcionalidade for function {}", id);
        return funcionalidadeService.countTotalFuncao(id);
    }

}
