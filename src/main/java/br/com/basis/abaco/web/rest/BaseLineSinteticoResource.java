package br.com.basis.abaco.web.rest;

import com.codahale.metrics.annotation.Timed;
import br.com.basis.abaco.domain.BaseLineSintetico;

import br.com.basis.abaco.repository.BaseLineSinteticoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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


}
