package br.com.basis.abaco.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.modelmapper.ModelMapper;
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

import com.codahale.metrics.annotation.Timed;

import br.com.basis.abaco.domain.FuncaoDados;
import br.com.basis.abaco.repository.FuncaoDadosRepository;
import br.com.basis.abaco.repository.search.FuncaoDadosSearchRepository;
import br.com.basis.abaco.service.FuncaoDadosService;
import br.com.basis.abaco.service.dto.DropdownDTO;
import br.com.basis.abaco.service.dto.FuncaoDadoApiDTO;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing FuncaoDados.
 */
@RestController
@RequestMapping("/api")
public class FuncaoDadosResource {

    private final Logger log = LoggerFactory.getLogger(FuncaoDadosResource.class);

    private static final String ENTITY_NAME = "funcaoDados";

    private final FuncaoDadosRepository funcaoDadosRepository;

    private final FuncaoDadosSearchRepository funcaoDadosSearchRepository;

    private final FuncaoDadosService funcaoDadosService;

    public FuncaoDadosResource(FuncaoDadosRepository funcaoDadosRepository,
            FuncaoDadosSearchRepository funcaoDadosSearchRepository, FuncaoDadosService funcaoDadosService) {
        this.funcaoDadosRepository = funcaoDadosRepository;
        this.funcaoDadosSearchRepository = funcaoDadosSearchRepository;
        this.funcaoDadosService = funcaoDadosService;
    }

    /**
     * POST  /funcao-dados : Create a new funcaoDados.
     *
     * @param funcaoDados the funcaoDados to create
     * @return the ResponseEntity with status 201 (Created) and with body the new funcaoDados, or with status 400 (Bad Request) if the funcaoDados has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/funcao-dados")
    @Timed
    @Secured({"ROLE_ADMIN", "ROLE_USER", "ROLE_GESTOR"})
    public ResponseEntity<FuncaoDados> createFuncaoDados(@RequestBody FuncaoDados funcaoDados) throws URISyntaxException {

        FuncaoDados f = funcaoDadosRepository.findName(2101l, funcaoDados.getName());

        log.debug("FuncaoDados : {}", f.toString());


        log.debug("REST request to save FuncaoDados : {}", funcaoDados);
        if (funcaoDados.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new funcaoDados cannot already have an ID")).body(null);
        }
        FuncaoDados result = funcaoDadosRepository.save(funcaoDados);
        funcaoDadosSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/funcao-dados/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /funcao-dados : Updates an existing funcaoDados.
     *
     * @param funcaoDados the funcaoDados to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated funcaoDados,
     * or with status 400 (Bad Request) if the funcaoDados is not valid,
     * or with status 500 (Internal Server Error) if the funcaoDados couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/funcao-dados")
    @Timed
    @Secured({"ROLE_ADMIN", "ROLE_USER", "ROLE_GESTOR"})
    public ResponseEntity<FuncaoDados> updateFuncaoDados(@RequestBody FuncaoDados funcaoDados) throws URISyntaxException {
        log.debug("REST request to update FuncaoDados : {}", funcaoDados);
        if (funcaoDados.getId() == null) {
            return createFuncaoDados(funcaoDados);
        }
        FuncaoDados result = funcaoDadosRepository.save(funcaoDados);
        funcaoDadosSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, funcaoDados.getId().toString()))
            .body(result);
    }

    /**
     * GET  /funcao-dados : get all the funcaoDados.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of funcaoDados in body
     */
    @GetMapping("/funcao-dados")
    @Timed
    public List<FuncaoDados> getAllFuncaoDados() {
        log.debug("REST request to get all FuncaoDados");
        List<FuncaoDados> funcaoDados = funcaoDadosRepository.findAll();
        funcaoDados.stream().filter(f -> f.getAnalise() != null).forEach(f -> {
            if (f.getAnalise().getFuncaoDados() != null) {
                f.getAnalise().getFuncaoDados().clear();
            }
            if (f.getAnalise().getFuncaoTransacaos() != null) {
                f.getAnalise().getFuncaoTransacaos().clear();
            }
        });
        return funcaoDados;
    }

    /**
     * GET  /funcao-dados/:id : get the "id" funcaoDados.
     *
     * @param id the id of the funcaoDados to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the funcaoDados, or with status 404 (Not Found)
     */
    @GetMapping("/funcao-dados/{id}")
    @Timed
    public ResponseEntity<FuncaoDadoApiDTO> getFuncaoDados(@PathVariable Long id) {
        log.debug("REST request to get FuncaoDados : {}", id);
        FuncaoDados funcaoDados = funcaoDadosRepository.findOne(id);
        if (funcaoDados.getAnalise().getFuncaoDados() != null) {
            funcaoDados.getAnalise().getFuncaoDados().clear();
        }
        if (funcaoDados.getAnalise().getFuncaoTransacaos() != null) {
            funcaoDados.getAnalise().getFuncaoTransacaos().clear();
        }

        ModelMapper modelMapper = new ModelMapper();

        FuncaoDadoApiDTO funcaoDadosDTO = modelMapper.map(funcaoDados, FuncaoDadoApiDTO.class);

        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(funcaoDadosDTO));
    }

    /**
     * GET  /funcao-dados/analise/:id : get the "id" analise.
     *
     * @param id the id of the funcaoDados to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the funcaoDados, or with status 404 (Not Found)
     */
    @GetMapping("/funcao-dados/analise/{id}")
    @Timed
    public List<FuncaoDados> getFuncaoDadosAnalise(@PathVariable Long id) {
        log.debug("REST request to get FuncaoDados : {}", id);
        List<FuncaoDados> funcaoDados = null;
        funcaoDados = funcaoDadosRepository.findByAnalise(id);
        return funcaoDados;
    }

    /**
     * DELETE  /funcao-dados/:id : delete the "id" funcaoDados.
     *
     * @param id the id of the funcaoDados to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/funcao-dados/{id}")
    @Timed
    @Secured({"ROLE_ADMIN", "ROLE_USER", "ROLE_GESTOR"})
    public ResponseEntity<Void> deleteFuncaoDados(@PathVariable Long id) {
        log.debug("REST request to delete FuncaoDados : {}", id);
        funcaoDadosRepository.delete(id);
        funcaoDadosSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/funcao-dados?query=:query : search for the funcaoDados corresponding
     * to the query.
     *
     * @param query the query of the funcaoDados search
     * @return the result of the search
     */
    @GetMapping("/_search/funcao-dados")
    @Timed
    public List<FuncaoDados> searchFuncaoDados(@RequestParam(defaultValue = "*") String query) {
        log.debug("REST request to search FuncaoDados for query {}", query);
        return StreamSupport
            .stream(funcaoDadosSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

    @GetMapping("/funcao-dados/drop-down")
    @Timed
    public List<DropdownDTO> getFuncaoDadosDropdown() {
        log.debug("REST request to get dropdown FuncaoDados");
        return funcaoDadosService.getFuncaoDadosDropdown();
    }

}
