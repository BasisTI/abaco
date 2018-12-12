package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.Grupo;
import br.com.basis.abaco.repository.GrupoRepository;
import com.codahale.metrics.annotation.Timed;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Grupo.
 */
@RestController
@RequestMapping("/api")
public class GrupoResource {

    private final Logger log = LoggerFactory.getLogger(GrupoResource.class);

    private static final String ENTITY_NAME = "grupo";

    private final GrupoRepository grupoRepository;


    public GrupoResource(GrupoRepository grupoRepository) {
        this.grupoRepository = grupoRepository;
    }

    /**
     * GET /grupos : get all the grupos.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of
     * grupos in body
     */
    @GetMapping("/grupos")
    @Timed
    public List<Grupo> getAllGrupos() {
        log.debug("REST request to get a page of Grupos");
        return grupoRepository.findAll();
    }

    /**
     * GET /grupos/:id : get the "id" grupo.
     *
     * @param id the id of the grupo to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the
     * grupo, or with status 404 (Not Found)
     */
    @GetMapping("/grupos/{id}")
    @Timed
    public ResponseEntity<Grupo> getGrupo(@PathVariable Long id) {
        log.debug("REST request to get Grupo : {}", id);
        Grupo grupo = grupoRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(grupo));
    }

}
