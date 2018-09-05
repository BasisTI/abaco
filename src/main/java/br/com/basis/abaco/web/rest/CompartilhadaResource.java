package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.Compartilhada;
import br.com.basis.abaco.repository.CompartilhadaRepository;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import br.com.basis.abaco.web.rest.util.PaginationUtil;
import com.codahale.metrics.annotation.Timed;
import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Compartilhada.
 */
@RestController
@RequestMapping("/api")
public class CompartilhadaResource {

    private final Logger log = LoggerFactory.getLogger(CompartilhadaResource.class);

    private static final String ENTITY_NAME = "compartilhada";

    private final CompartilhadaRepository compartilhadaRepository;


    /**
     * Método construtor.
     * @param compartilhadaRepository
     */
    public CompartilhadaResource(
             CompartilhadaRepository compartilhadaRepository) {
        this.compartilhadaRepository = compartilhadaRepository;
    }
    
    @PostMapping("/compartilhadas")
    @Timed
    public ResponseEntity<Compartilhada> createCompartilhada(@Valid @RequestBody Compartilhada compartilhada) throws URISyntaxException {
        log.debug("REST request to save Compartilhada : {}", compartilhada);
        Compartilhada result = compartilhadaRepository.save(compartilhada);
        return ResponseEntity.created(new URI("/api/compartilhadas/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString())).body(result);
    }

    /**
     *
     * @param id
     * @return
     */
    private Compartilhada recuperarCompartilhada(Long id) {
        return compartilhadaRepository.findOne(id);
    }

    /**
     * PUT /compartilhadas : Updates an existing compartilhada.
     *
     * @param compartilhada
     * the compartilhada to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated
     * compartilhada, or with status 400 (Bad Request) if the compartilhada is not
     * valid, or with status 500 (Internal Server Error) if the compartilhada
     * couldnt be updated
     * @throws URISyntaxException
     * if the Location URI syntax is incorrect
     */
    @PutMapping("/compartilhadas")
    @Timed
    public ResponseEntity<Compartilhada> updateCompartilhada(@Valid @RequestBody Compartilhada compartilhada) throws URISyntaxException {
        log.debug("REST request to update Compartilhada : {}", compartilhada);
        if (compartilhada.getId() == null) {
            return createCompartilhada(compartilhada);
        }
        Compartilhada result = compartilhadaRepository.save(compartilhada);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, compartilhada.getId().toString()))
                .body(result);
    }


    /**
     * GET /compartilhadas : get all the compartilhadas.
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of compartilhadas in body
     * @throws URISyntaxException
     * if there is an error to generate the pagination HTTP headers
     */
    @GetMapping("/compartilhadas")
    @Timed
    public ResponseEntity<List<Compartilhada>> getAllCompartilhadas(@ApiParam Pageable pageable) throws URISyntaxException {
        log.debug("REST request to get a page of Compartilhadas");
        Page<Compartilhada> page = compartilhadaRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/compartilhadas");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET /compartilhadas/:id : get the "id" compartilhada.
     * @param id
     * the id of the compartilhada to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the compartilhada, or
     * with status 404 (Not Found)
     */
    @GetMapping("/compartilhadas/{id}")
    @Timed
    public ResponseEntity<Compartilhada> getCompartilhada(@PathVariable Long id) {
        log.debug("REST request to get Compartilhada : {}", id);
        Compartilhada compartilhada = recuperarCompartilhada(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(compartilhada));
    }

    /**
     * DELETE /compartilhadas/:id : delete the "id" compartilhada.
     * @param id
     * the id of the compartilhada to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/compartilhadas/{id}")
    @Timed
    public ResponseEntity<Void> deleteCompartilhada(@PathVariable Long id) {
        log.debug("REST request to delete Compartilhada : {}", id);
        compartilhadaRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
