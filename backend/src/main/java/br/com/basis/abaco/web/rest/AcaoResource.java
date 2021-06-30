package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.Acao;
import br.com.basis.abaco.repository.AcaoRepository;
import br.com.basis.abaco.service.AcaoService;
import br.com.basis.abaco.service.dto.AcaoDTO;
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
 * REST controller for managing {@link Acao}.
 */
@RestController
@RequestMapping("/api")
public class AcaoResource {

    private final Logger log = LoggerFactory.getLogger(AcaoResource.class);

    private static final String ENTITY_NAME = "acao";

    private final AcaoService acaoService;

    private final AcaoRepository acaoRepository;

    public AcaoResource(AcaoService acaoService, AcaoRepository acaoRepository) {
        this.acaoService = acaoService;
        this.acaoRepository = acaoRepository;
    }

    /**
     * {@code POST  /acaos} : Create a new acao.
     *
     * @param acaoDTO the acaoDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new acaoDTO, or with status {@code 400 (Bad Request)} if the acao has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/acaos")
    public ResponseEntity<AcaoDTO> createAcao(@Valid @RequestBody AcaoDTO acaoDTO) throws URISyntaxException {
        log.debug("REST request to save Acao : {}", acaoDTO);
        if (acaoDTO.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists",
                "A new acao cannot already have an ID")).body(null);
        }
        AcaoDTO result = acaoService.save(acaoDTO);
        return ResponseEntity.created(new URI("/api/acaos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString())).body(result);
    }

    /**
     * {@code PUT  /acaos} : Updates an existing acao.
     *
     * @param acaoDTO the acaoDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated acaoDTO,
     * or with status {@code 400 (Bad Request)} if the acaoDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the acaoDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/acaos")
    public ResponseEntity<AcaoDTO> updateAcao(@Valid @RequestBody AcaoDTO acaoDTO) throws URISyntaxException {
        log.debug("REST request to update Acao : {}", acaoDTO);
        if (acaoDTO.getId() == null) {
            return createAcao(acaoDTO);
        }
        AcaoDTO result = acaoService.save(acaoDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, result.getId().toString())).body(result);
    }

    /**
     * {@code GET  /acaos} : get all the acaos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of acaos in body.
     */
    @GetMapping("/acaos")
    public List<Acao> getAllAcaos() {
        log.debug("REST request to get a page of Acaos");
        return acaoRepository.findAll();
    }

    /**
     * {@code GET  /acaos/:id} : get the "id" acao.
     *
     * @param id the id of the acaoDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the acaoDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/acaos/{id}")
    public ResponseEntity<AcaoDTO> getAcao(@PathVariable Long id) {
        log.debug("REST request to get Acao : {}", id);
        Optional<AcaoDTO> acaoDTO = acaoService.findOne(id);
        return ResponseUtil.wrapOrNotFound(acaoDTO);
    }

    /**
     * {@code GET  /acaos/sigla/:sigla} : get the "sigla" acao.
     *
     * @param sigla the sigla of the acao to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the acaoDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/acaos/sigla/{sigla}")
    public ResponseEntity<Acao> getAcaoBySigla(@PathVariable String sigla) {
        log.debug("REST request to get Acao : {}", sigla);
        Optional<Acao> acao = acaoService.findOneBySigla(sigla);
        return ResponseUtil.wrapOrNotFound(acao);
    }

    /**
     * {@code DELETE  /acaos/:id} : delete the "id" acao.
     *
     * @param id the id of the acaoDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/acaos/{id}")
    public ResponseEntity<Void> deleteAcao(@PathVariable Long id) {
        log.debug("REST request to delete Acao : {}", id);
        acaoService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
