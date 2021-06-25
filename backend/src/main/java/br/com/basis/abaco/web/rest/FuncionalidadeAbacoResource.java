package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.FuncionalidadeAbaco;
import br.com.basis.abaco.repository.FuncionalidadeAbacoRepository;
import br.com.basis.abaco.service.FuncionalidadeAbacoService;
import br.com.basis.abaco.service.dto.FuncionalidadeAbacoDTO;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
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
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link FuncionalidadeAbaco}.
 */
@RestController
@RequestMapping("/api")
public class FuncionalidadeAbacoResource {

    private final Logger log = LoggerFactory.getLogger(FuncionalidadeAbacoResource.class);

    private static final String ENTITY_NAME = "funcionalidadeAbaco";

    private final FuncionalidadeAbacoService funcionalidadeAbacoService;

    private final FuncionalidadeAbacoRepository funcionalidadeAbacoRepository;

    public FuncionalidadeAbacoResource(FuncionalidadeAbacoService funcionalidadeAbacoService, FuncionalidadeAbacoRepository funcionalidadeAbacoRepository) {
        this.funcionalidadeAbacoService = funcionalidadeAbacoService;
        this.funcionalidadeAbacoRepository = funcionalidadeAbacoRepository;
    }

    /**
     * {@code POST  /funcionalidade-abacos} : Create a new funcionalidadeAbaco.
     *
     * @param funcionalidadeAbacoDTO the funcionalidadeAbacoDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new funcionalidadeAbacoDTO, or with status {@code 400 (Bad Request)} if the funcionalidadeAbaco has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/funcionalidade-abacos")
    public ResponseEntity<FuncionalidadeAbacoDTO> createFuncionalidadeAbaco(@Valid @RequestBody FuncionalidadeAbacoDTO funcionalidadeAbacoDTO) throws URISyntaxException {
        log.debug("REST request to save FuncionalidadeAbaco : {}", funcionalidadeAbacoDTO);
        if (funcionalidadeAbacoDTO.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists",
                "A new funcionalidadeAbaco cannot already have an ID")).body(null);
        }
        FuncionalidadeAbacoDTO result = funcionalidadeAbacoService.save(funcionalidadeAbacoDTO);
        return ResponseEntity.created(new URI("/api/funcionalidade-abacos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString())).body(result);
    }

    /**
     * {@code PUT  /funcionalidade-abacos} : Updates an existing funcionalidadeAbaco.
     *
     * @param funcionalidadeAbacoDTO the funcionalidadeAbacoDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated funcionalidadeAbacoDTO,
     * or with status {@code 400 (Bad Request)} if the funcionalidadeAbacoDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the funcionalidadeAbacoDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/funcionalidade-abacos")
    public ResponseEntity<FuncionalidadeAbacoDTO> updateFuncionalidadeAbaco(@Valid @RequestBody FuncionalidadeAbacoDTO funcionalidadeAbacoDTO) throws URISyntaxException {
        log.debug("REST request to update FuncionalidadeAbaco : {}", funcionalidadeAbacoDTO);
        if (funcionalidadeAbacoDTO.getId() == null) {
            return createFuncionalidadeAbaco(funcionalidadeAbacoDTO);
        }
        FuncionalidadeAbacoDTO result = funcionalidadeAbacoService.save(funcionalidadeAbacoDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, result.getId().toString())).body(result);
    }

    /**
     * {@code GET  /funcionalidade-abacos} : get all the funcionalidadeAbacos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of funcionalidadeAbacos in body.
     */
    @GetMapping("/funcionalidade-abacos")
    public List<FuncionalidadeAbaco> getAllFuncionalidadeAbacos() {
        log.debug("REST request to get a page of FuncionalidadeAbacos");
        return funcionalidadeAbacoRepository.findAll();
    }

    /**
     * {@code GET  /funcionalidade-abacos/:id} : get the "id" funcionalidadeAbaco.
     *
     * @param id the id of the funcionalidadeAbacoDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the funcionalidadeAbacoDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/funcionalidade-abacos/{id}")
    public ResponseEntity<FuncionalidadeAbacoDTO> getFuncionalidadeAbaco(@PathVariable Long id) {
        log.debug("REST request to get FuncionalidadeAbaco : {}", id);
        Optional<FuncionalidadeAbacoDTO> funcionalidadeAbacoDTO = funcionalidadeAbacoService.findOne(id);
        return ResponseUtil.wrapOrNotFound(funcionalidadeAbacoDTO);
    }

    /**
     * {@code GET  /funcionalidade-abacos/sigla/:sigla} : get the "sigla" funcionalidadeAbaco.
     *
     * @param sigla the sigla of the funcionalidadeAbaco to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the funcionalidadeAbaco, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/funcionalidade-abacos/sigla/{sigla}")
    public ResponseEntity<FuncionalidadeAbaco> getFuncionalidadeAbaco(@PathVariable String sigla) {
        log.debug("REST request to get FuncionalidadeAbaco : {}", sigla);
        Optional<FuncionalidadeAbaco> funcionalidadeAbaco = funcionalidadeAbacoService.findOneBySigla(sigla);
        return ResponseUtil.wrapOrNotFound(funcionalidadeAbaco);
    }

    /**
     * {@code DELETE  /funcionalidade-abacos/:id} : delete the "id" funcionalidadeAbaco.
     *
     * @param id the id of the funcionalidadeAbacoDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/funcionalidade-abacos/{id}")
    public ResponseEntity<Void> deleteFuncionalidadeAbaco(@PathVariable Long id) {
        log.debug("REST request to delete FuncionalidadeAbaco : {}", id);
        funcionalidadeAbacoService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
