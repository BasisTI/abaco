package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.Perfil;
import br.com.basis.abaco.repository.PerfilRepository;
import br.com.basis.abaco.repository.search.PerfilSearchRepository;
import br.com.basis.abaco.service.PerfilService;
import br.com.basis.abaco.service.dto.DropdownDTO;
import br.com.basis.abaco.service.dto.PerfilDTO;
import br.com.basis.abaco.service.exception.RelatorioException;
import br.com.basis.abaco.utils.PageUtils;
import br.com.basis.abaco.web.rest.errors.CustomParameterizedException;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import br.com.basis.abaco.web.rest.util.PaginationUtil;
import br.com.basis.dynamicexports.util.DynamicExporter;
import com.codahale.metrics.annotation.Timed;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
import java.io.ByteArrayOutputStream;
import java.lang.reflect.InvocationTargetException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * REST controller for managing {@link Perfil}.
 */
@RestController
@RequestMapping("/api")
public class PerfilResource {

    private final Logger log = LoggerFactory.getLogger(PerfilResource.class);

    private static final String ENTITY_NAME = "perfil";

    private final PerfilService perfilService;

    private final PerfilRepository perfilRepository;

    private final PerfilSearchRepository perfilSearchRepository;

    public PerfilResource(PerfilService perfilService, PerfilRepository perfilRepository, PerfilSearchRepository perfilSearchRepository) {
        this.perfilService = perfilService;
        this.perfilRepository = perfilRepository;
        this.perfilSearchRepository = perfilSearchRepository;
    }

    /**
     * {@code POST  /perfils} : Create a new perfil.
     *
     * @param perfilDTO the perfilDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new perfilDTO, or with status {@code 400 (Bad Request)} if the perfil has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/perfils")
    @Secured("ROLE_ABACO_PERFIL_CADASTRAR")
    public ResponseEntity<Perfil> createPerfil(@Valid @RequestBody PerfilDTO perfilDTO) throws URISyntaxException, InvocationTargetException, IllegalAccessException {
        log.debug("REST request to save Perfil : {}", perfilDTO);
        if (perfilDTO.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists",
                "A new perfil cannot already have an ID")).body(null);
        }else if(perfilRepository.findByNome(perfilDTO.getNome()).isPresent()){
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "nameexists", "Nome do perfil já existe."))
                .body(null);
        }
        Perfil result = perfilService.save(perfilDTO);
        return ResponseEntity.created(new URI("/api/perfils/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString())).body(result);
    }

    /**
     * {@code PUT  /perfils} : Updates an existing perfil.
     *
     * @param perfilDTO the perfilDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated perfilDTO,
     * or with status {@code 400 (Bad Request)} if the perfilDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the perfilDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/perfils")
    @Secured("ROLE_ABACO_PERFIL_EDITAR")
    public ResponseEntity<Perfil> updatePerfil(@Valid @RequestBody PerfilDTO perfilDTO) throws URISyntaxException, InvocationTargetException, IllegalAccessException {
        log.debug("REST request to update Perfil : {}", perfilDTO);
        Optional<Perfil> existingPerfil = perfilRepository.findByNome(perfilDTO.getNome());
        if(existingPerfil.isPresent() && !existingPerfil.get().getId().equals(perfilDTO.getId())){
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "nameexists", "Nome do perfil já existe."))
                .body(null);
        }
        if (perfilDTO.getId() == null) {
            createPerfil(perfilDTO);
        }
        Perfil result = perfilService.save(perfilDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, result.getId().toString())).body(result);
    }

    @GetMapping("/_search/perfil")
    @Timed
    @Secured({"ROLE_ABACO_PERFIL_PESQUISAR", "ROLE_ABACO_PERFIL_ACESSAR"})
    public ResponseEntity<List<Perfil>> searchPerfil(@RequestParam(defaultValue = "*") String query, @RequestParam(defaultValue = "ASC", required = false) String order, @RequestParam(name = "page") int pageNumber, @RequestParam int size, @RequestParam(defaultValue = "id") String sort) throws URISyntaxException {
        log.debug("REST request to search for a page of Perfil for query {}", query);
        Sort.Direction sortOrder = PageUtils.getSortDirection(order);
        Pageable newPageable = new PageRequest(pageNumber, size, sortOrder, sort);

        Page<Perfil> page = perfilSearchRepository.search(queryStringQuery(query), newPageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/perfil");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * {@code GET  /perfils} : get all the perfils.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of perfils in body.
     */
    @GetMapping("/perfils")
    public List<Perfil> getAllPerfils() {
        log.debug("REST request to get a page of Perfils");
        return perfilRepository.findAll();
    }

    /**
     * {@code GET  /perfils} : get all the perfils ativo.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of perfils in body.
     */
    @GetMapping("/perfils/ativo")
    public List<Perfil> getAllPerfilsAtivo() {
        log.debug("REST request to get a page of Perfils");
        return perfilRepository.findAllByFlgAtivoIsTrue();
    }

    /**
     * {@code GET  /perfils/:id} : get the "id" perfil.
     *
     * @param id the id of the perfilDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the perfilDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/perfils/{id}")
    @Secured({"ROLE_ABACO_PERFIL_CONSULTAR", "ROLE_ABACO_PERFIL_EDITAR"})
    public ResponseEntity<Perfil> getPerfil(@PathVariable Long id) {
        log.debug("REST request to get Perfil : {}", id);
        Optional<Perfil> perfil = perfilService.findOne(id);
        return ResponseUtil.wrapOrNotFound(perfil);
    }

    /**
     * {@code DELETE  /perfils/:id} : delete the "id" perfil.
     *
     * @param id the id of the perfilDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/perfils/{id}")
    @Secured("ROLE_ABACO_PERFIL_EXCLUIR")
    public ResponseEntity<String> deletePerfil(@PathVariable Long id) {
        log.debug("REST request to delete Perfil : {}", id);

        Optional<Perfil> perfil = perfilRepository.findById(id);
        if(perfil.isPresent() && !perfil.get().getUsers().isEmpty()){
            throw new CustomParameterizedException("UsuarioRelacionado");
        }

        perfilService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @PostMapping(value = "/perfils/exportacao/{tipoRelatorio}", produces = MediaType.APPLICATION_PDF_VALUE)
    @Timed
    @Secured("ROLE_ABACO_PERFIL_EXPORTAR")
    public ResponseEntity<InputStreamResource> gerarRelatorio(@PathVariable String tipoRelatorio, @RequestParam(defaultValue = "*") String query) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream = perfilService.gerarRelatorio(query, tipoRelatorio);
        return DynamicExporter.output(byteArrayOutputStream, "relatorio");
    }

    @PostMapping(value = "/perfils/exportacao-arquivo", produces = MediaType.APPLICATION_PDF_VALUE)
    @Timed
    @Secured("ROLE_ABACO_PERFIL_EXPORTAR")
    public ResponseEntity<byte[]> gerarRelatorioImprimir(@RequestParam(defaultValue = "*") String query) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream = perfilService.gerarRelatorio(query, "pdf");
        return new ResponseEntity<byte[]>(byteArrayOutputStream.toByteArray(), HttpStatus.OK);
    }

    @GetMapping("/perfils/drop-down")
    @Timed
    public List<DropdownDTO> getPerfilDropdown() {
        log.debug("REST request to get dropdown Perfil");
        return perfilService.getPerfilDropdown();
    }
}
