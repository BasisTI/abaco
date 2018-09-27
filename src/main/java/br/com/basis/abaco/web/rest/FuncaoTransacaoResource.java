package br.com.basis.abaco.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

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

import br.com.basis.abaco.domain.FuncaoTransacao;
import br.com.basis.abaco.repository.FuncaoTransacaoRepository;
import br.com.basis.abaco.repository.search.FuncaoTransacaoSearchRepository;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing FuncaoTransacao.
 */
@RestController
@RequestMapping("/api")
public class FuncaoTransacaoResource {

    private final Logger log = LoggerFactory.getLogger(FuncaoTransacaoResource.class);

    private static final String ENTITY_NAME = "funcaoTransacao";

    private final FuncaoTransacaoRepository funcaoTransacaoRepository;

    private final FuncaoTransacaoSearchRepository funcaoTransacaoSearchRepository;

    public FuncaoTransacaoResource(FuncaoTransacaoRepository funcaoTransacaoRepository, FuncaoTransacaoSearchRepository funcaoTransacaoSearchRepository) {
        this.funcaoTransacaoRepository = funcaoTransacaoRepository;
        this.funcaoTransacaoSearchRepository = funcaoTransacaoSearchRepository;
    }

    /**
     * POST  /funcao-transacaos : Create a new funcaoTransacao.
     *
     * @param funcaoTransacao the funcaoTransacao to create
     * @return the ResponseEntity with status 201 (Created) and with body the new funcaoTransacao, or with status 400 (Bad Request) if the funcaoTransacao has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/funcao-transacaos")
    @Timed
    @Secured({"ROLE_ADMIN", "ROLE_USER", "ROLE_GESTOR"})
    public ResponseEntity<FuncaoTransacao> createFuncaoTransacao(@RequestBody FuncaoTransacao funcaoTransacao) throws URISyntaxException {
        log.debug("REST request to save FuncaoTransacao : {}", funcaoTransacao);
        if (funcaoTransacao.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new funcaoTransacao cannot already have an ID")).body(null);
        }
        FuncaoTransacao result = funcaoTransacaoRepository.save(funcaoTransacao);
        funcaoTransacaoSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/funcao-transacaos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /funcao-transacaos : Updates an existing funcaoTransacao.
     *
     * @param funcaoTransacao the funcaoTransacao to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated funcaoTransacao,
     * or with status 400 (Bad Request) if the funcaoTransacao is not valid,
     * or with status 500 (Internal Server Error) if the funcaoTransacao couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/funcao-transacaos")
    @Timed
    @Secured({"ROLE_ADMIN", "ROLE_USER", "ROLE_GESTOR"})
    public ResponseEntity<FuncaoTransacao> updateFuncaoTransacao(@RequestBody FuncaoTransacao funcaoTransacao) throws URISyntaxException {
        log.debug("REST request to update FuncaoTransacao : {}", funcaoTransacao);
        if (funcaoTransacao.getId() == null) {
            return createFuncaoTransacao(funcaoTransacao);
        }
        FuncaoTransacao result = funcaoTransacaoRepository.save(funcaoTransacao);
        funcaoTransacaoSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, funcaoTransacao.getId().toString()))
            .body(result);
    }

    /**
     * GET  /funcao-transacaos : get all the funcaoTransacaos.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of funcaoTransacaos in body
     */
    @GetMapping("/funcao-transacaos")
    @Timed
    public List<FuncaoTransacao> getAllFuncaoTransacaos() {
        log.debug("REST request to get all FuncaoTransacaos");
        List<FuncaoTransacao> funcaoTransacaos = funcaoTransacaoRepository.findAll();
        funcaoTransacaos.stream().filter(f->f.getAnalise()!=null).forEach(f -> {
            if (f.getAnalise().getFuncaoDados() != null) {
                f.getAnalise().getFuncaoDados().clear();
            }
            if (f.getAnalise().getFuncaoTransacaos() != null) {
                f.getAnalise().getFuncaoTransacaos().clear();
            }
        });
        return funcaoTransacaos;
    }

    /**
     * GET  /funcao-transacaos/:id : get the "id" funcaoTransacao.
     *
     * @param id the id of the funcaoTransacao to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the funcaoTransacao, or with status 404 (Not Found)
     */
    @GetMapping("/funcao-transacaos/{id}")
    @Timed
    public ResponseEntity<FuncaoTransacao> getFuncaoTransacao(@PathVariable Long id) {
        log.debug("REST request to get FuncaoTransacao : {}", id);
        FuncaoTransacao funcaoTransacao = funcaoTransacaoRepository.findOne(id);
        if (funcaoTransacao.getAnalise().getFuncaoDados() != null) {
            funcaoTransacao.getAnalise().getFuncaoDados().clear();
        }
        if (funcaoTransacao.getAnalise().getFuncaoTransacaos() != null) {
            funcaoTransacao.getAnalise().getFuncaoTransacaos().clear();
        }
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(funcaoTransacao));
    }

    /**
     * DELETE  /funcao-transacaos/:id : delete the "id" funcaoTransacao.
     *
     * @param id the id of the funcaoTransacao to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/funcao-transacaos/{id}")
    @Timed
    @Secured({"ROLE_ADMIN", "ROLE_USER", "ROLE_GESTOR"})
    public ResponseEntity<Void> deleteFuncaoTransacao(@PathVariable Long id) {
        log.debug("REST request to delete FuncaoTransacao : {}", id);
        funcaoTransacaoRepository.delete(id);
        funcaoTransacaoSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/funcao-transacaos?query=:query : search for the funcaoTransacao corresponding
     * to the query.
     *
     * @param query the query of the funcaoTransacao search
     * @return the result of the search
     */
    @GetMapping("/_search/funcao-transacaos")
    @Timed
    public List<FuncaoTransacao> searchFuncaoTransacaos(@RequestParam(defaultValue = "*") String query) {
        log.debug("REST request to search FuncaoTransacaos for query {}", query);
        return StreamSupport
            .stream(funcaoTransacaoSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }


}
