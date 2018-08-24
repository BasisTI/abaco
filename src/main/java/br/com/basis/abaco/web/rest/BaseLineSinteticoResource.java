package br.com.basis.abaco.web.rest;

import com.codahale.metrics.annotation.Timed;
import br.com.basis.abaco.domain.BaseLineSintetico;

import br.com.basis.abaco.repository.BaseLineSinteticoRepository;
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
 * REST controller for managing BaseLineSintetico.
 */
@RestController
@RequestMapping("/api")
public class BaseLineSinteticoResource {

    private final Logger log = LoggerFactory.getLogger(BaseLineSinteticoResource.class);

    private static final String ENTITY_NAME = "baseLineSintetico";

    private final BaseLineSinteticoRepository baseLineSinteticoRepository;


    public BaseLineSinteticoResource(BaseLineSinteticoRepository baseLineSinteticoRepository) {
        this.baseLineSinteticoRepository = baseLineSinteticoRepository;
    }


    @GetMapping("/baseline-sinteticos")
    @Timed
    public List<BaseLineSintetico> getAllBaseLineSinteticos() {
        log.debug("REST request to get all BaseLineSinteticos");
        return baseLineSinteticoRepository.findAll();
    }

    @GetMapping("/baseline-sinteticos/{id}")
    @Timed
    public ResponseEntity<BaseLineSintetico> getBaseLineSintetico(@PathVariable Long id) {
        log.debug("REST request to get all BaseLineSinteticos: {}", id);
        BaseLineSintetico funcaoDados = baseLineSinteticoRepository.getBaseLineSinteticoId(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(funcaoDados));
    }


}
