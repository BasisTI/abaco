package br.com.basis.abaco.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

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

import br.com.basis.abaco.domain.Permissao;
import br.com.basis.abaco.repository.PermissaoRepository;
import br.com.basis.abaco.service.PermissaoService;
import br.com.basis.abaco.service.dto.PermissaoDTO;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link Permissao}.
 */
@RestController
@RequestMapping("/api")
public class PermissaoResource {

    private final Logger log = LoggerFactory.getLogger(PermissaoResource.class);

    private static final String ENTITY_NAME = "permissao";

    private final PermissaoService permissaoService;

    private final PermissaoRepository permissaoRepository;

    public PermissaoResource(PermissaoService permissaoService, PermissaoRepository permissaoRepository) {
        this.permissaoService = permissaoService;
        this.permissaoRepository = permissaoRepository;
    }

    /**
     * {@code POST  /permissaos} : Create a new permissao.
     *
     * @param permissaoDTO the permissaoDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new permissaoDTO, or with status {@code 400 (Bad Request)} if the permissao has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/permissaos")
    public ResponseEntity<Permissao> createPermissao(@RequestBody PermissaoDTO permissaoDTO) throws URISyntaxException {
        log.debug("REST request to save Permissao : {}", permissaoDTO);
        if (permissaoDTO.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists",
                "A new permissao cannot already have an ID")).body(null);
        }
        Permissao result = permissaoService.save(permissaoDTO);
        return ResponseEntity.created(new URI("/api/permissaos/" + result.getId()))
        .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString())).body(result);
    }

    /**
     * {@code PUT  /permissaos} : Updates an existing permissao.
     *
     * @param permissaoDTO the permissaoDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated permissaoDTO,
     * or with status {@code 400 (Bad Request)} if the permissaoDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the permissaoDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/permissaos")
    public ResponseEntity<Permissao> updatePermissao(@RequestBody PermissaoDTO permissaoDTO) throws URISyntaxException {
        log.debug("REST request to update Permissao : {}", permissaoDTO);
        if (permissaoDTO.getId() == null) {
            return createPermissao(permissaoDTO);
        }
        Permissao result = permissaoService.save(permissaoDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, result.getId().toString())).body(result);
    }

    /**
     * {@code GET  /permissaos} : get all the permissaos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of permissaos in body.
     */
    @GetMapping("/permissaos")
    public List<Permissao> getAllPermissaos() {
        log.debug("REST request to get a page of Permissaos");
        return permissaoRepository.findAllByFuncionalidadeAbaco();
    }

    @GetMapping("/permissaos/perfis")
    public Set<String> getAllPermissaosByPerfil(@RequestParam(value = "perfis", required = true) Set<String> perfis) {
        List<Permissao> permissoes = permissaoRepository.pesquisarPermissoesPorPerfil(perfis);
        Set<String> listPermissoes = new HashSet<>();
        permissoes.forEach(permissao -> {
            listPermissoes.add("ROLE_ABACO_"+permissao.getFuncionalidadeAbaco().getSigla()+"_"+permissao.getAcao().getSigla());
        });
        return listPermissoes;
    }

    /**
     * {@code GET  /permissaos/:id} : get the "id" permissao.
     *
     * @param id the id of the Permissao to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the permissaoDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/permissaos/{id}")
    public ResponseEntity<Permissao> getPermissao(@PathVariable Long id) {
        log.debug("REST request to get Permissao : {}", id);
        Optional<Permissao> permissao = permissaoService.findOne(id);
        return ResponseUtil.wrapOrNotFound(permissao);
    }

    /**
     * {@code DELETE  /permissaos/:id} : delete the "id" permissao.
     *
     * @param id the id of the permissaoDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/permissaos/{id}")
    public ResponseEntity<Void> deletePermissao(@PathVariable Long id) {
        log.debug("REST request to delete Permissao : {}", id);
        permissaoService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
