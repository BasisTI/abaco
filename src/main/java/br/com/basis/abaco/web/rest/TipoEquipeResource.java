package br.com.basis.abaco.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.multiMatchQuery;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.io.ByteArrayOutputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

import br.com.basis.abaco.domain.TipoEquipe;
import br.com.basis.abaco.repository.TipoEquipeRepository;
import br.com.basis.abaco.repository.search.TipoEquipeSearchRepository;
import br.com.basis.abaco.security.SecurityUtils;
import br.com.basis.abaco.service.TipoEquipeService;
import br.com.basis.abaco.service.dto.DropdownDTO;
import br.com.basis.abaco.service.exception.RelatorioException;
import br.com.basis.abaco.service.relatorio.RelatorioEquipeColunas;
import br.com.basis.abaco.utils.AbacoUtil;
import br.com.basis.abaco.utils.PageUtils;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import br.com.basis.abaco.web.rest.util.PaginationUtil;
import br.com.basis.dynamicexports.service.DynamicExportsService;
import br.com.basis.dynamicexports.util.DynamicExporter;
import io.github.jhipster.web.util.ResponseUtil;
import net.sf.dynamicreports.report.exception.DRException;
import net.sf.jasperreports.engine.JRException;

/**
 * REST controller for managing TipoEquipe.
 */
@RestController
@RequestMapping("/api")
public class TipoEquipeResource {

    private final Logger log = LoggerFactory.getLogger(TipoEquipeResource.class);

    private static final String ENTITY_NAME = "tipoEquipe";

    private final TipoEquipeRepository tipoEquipeRepository;

    private final TipoEquipeSearchRepository tipoEquipeSearchRepository;

    private final DynamicExportsService dynamicExportsService;

    private final TipoEquipeService tipoEquipeService;

    private static final String ROLE_ANALISTA = "ROLE_ANALISTA";

    private static final String ROLE_ADMIN = "ROLE_ADMIN";

    private static final String ROLE_USER = "ROLE_USER";

    private static final String ROLE_GESTOR = "ROLE_GESTOR";


    public TipoEquipeResource(TipoEquipeRepository tipoEquipeRepository,
            TipoEquipeSearchRepository tipoEquipeSearchRepository, DynamicExportsService dynamicExportsService,
            TipoEquipeService tipoEquipeService) {

        this.tipoEquipeRepository = tipoEquipeRepository;
        this.tipoEquipeSearchRepository = tipoEquipeSearchRepository;
        this.dynamicExportsService = dynamicExportsService;
        this.tipoEquipeService = tipoEquipeService;
    }

    /**
     * POST /tipo-equipes : Create a new tipoEquipe.
     *
     * @param tipoEquipe the tipoEquipe to create
     * @return the ResponseEntity with status 201 (Created) and with body the
     * new tipoEquipe, or with status 400 (Bad Request) if the tipoEquipe has
     * already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/tipo-equipes")
    @Timed
    @Secured({ROLE_ADMIN, ROLE_USER, ROLE_GESTOR, ROLE_ANALISTA})
    public ResponseEntity<TipoEquipe> createTipoEquipe(@Valid @RequestBody TipoEquipe tipoEquipe)
            throws URISyntaxException {
        log.debug("REST request to save TipoEquipe : {}", tipoEquipe);
        if (tipoEquipe.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists",
                    "A new TipoEquipe cannot already have an ID")).body(null);
        }
        TipoEquipe result = tipoEquipeRepository.save(tipoEquipe);
        tipoEquipeSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/tipo-equipes/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString())).body(result);
    }

    /**
     * PUT /tipo-equipes : Updates an existing tipoEquipe.
     *
     * @param tipoEquipe the tipoEquipe to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated
     * tipoEquipe, or with status 400 (Bad Request) if the tipoEquipe is not
     * valid, or with status 500 (Internal Server Error) if the tipoEquipe
     * couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/tipo-equipes")
    @Timed
    @Secured({ROLE_ADMIN, ROLE_USER, ROLE_GESTOR, ROLE_ANALISTA})
    public ResponseEntity<TipoEquipe> updateTipoEquipe(@Valid @RequestBody TipoEquipe tipoEquipe)
            throws URISyntaxException {
        log.debug("REST request to update TipoEquipe : {}", tipoEquipe);
        if (tipoEquipe.getId() == null) {
            return createTipoEquipe(tipoEquipe);
        }
        TipoEquipe result = tipoEquipeRepository.save(tipoEquipe);
        tipoEquipeSearchRepository.save(result);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, tipoEquipe.getId().toString())).body(result);
    }

    @GetMapping("/tipo-equipes/drop-down")
    @Timed
    public List<DropdownDTO> getTipoEquipeDropdown() {
        log.debug("REST request to get dropdown TipoEquipes");
        return tipoEquipeService.getTipoEquipeDropdown();
    }

    /**
     * GET /tipo-equipes/:id : get the "id" tipoEquipe.
     *
     * @param id the id of the tipoEquipe to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the
     * tipoEquipe, or with status 404 (Not Found)
     */
    @GetMapping("/tipo-equipes/{id}")
    @Timed
    public ResponseEntity<TipoEquipe> getTipoEquipe(@PathVariable Long id) {
        log.debug("REST request to get TipoEquipe : {}", id);
        TipoEquipe tipoEquipe = tipoEquipeRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(tipoEquipe));
    }

    /**
     * GET /tipo-equipes/:idUser : get the "id" tipoEquipe.
     *
     * @param idUser the id of the user to search for tipoEquipe
     * @return the ResponseEntity with status 200 (OK) and with body the
     * tipoEquipe, or with status 404 (Not Found)
     */
    @GetMapping("/tipo-equipes/user/{idUser}")
    @Timed
    public ResponseEntity<List<Long>> getTipoEquipeByUser(@PathVariable Long idUser) {
        log.debug("REST request to get TipoEquipe : {}", idUser);
        List<Long> idTipoEquipe = tipoEquipeRepository.findAllByUserId(idUser);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(idTipoEquipe));
    }

    /**
     *
     * @param idOrganizacao
     * @return
     */
    @GetMapping("/tipo-equipes/organizacoes/{idOrganizacao}")
    @Timed
    public List<TipoEquipe> getAllTipoEquipeByOrganizacao(@PathVariable Long idOrganizacao) {
        log.debug("REST request to get all TipoEquipes by org id");
        return tipoEquipeRepository.findAllEquipesByOrganizacaoId(idOrganizacao);
    }

    /**
     *
     * @param idOrganizacao
     * @return
     */
    @GetMapping("/tipo-equipes/current-user/{idOrganizacao}")
    @Timed
    public List<TipoEquipe> getAllTipoEquipeByOrganizacaoAndLoggedUser(@PathVariable Long idOrganizacao) {
        log.debug("REST request to get all TipoEquipes by logged user login");
        return tipoEquipeRepository.findAllByOrganizacaoAndUsuario(SecurityUtils.getCurrentUserLogin(), idOrganizacao);
    }


    @GetMapping("/tipo-equipes/compartilhar/{idOrganizacao}/{idAnalise}/{idEquipe}")
    @Timed
    public List<TipoEquipe> getAllTipoEquipeCompartilhavel(@PathVariable Long idOrganizacao, @PathVariable Long idAnalise, @PathVariable Long idEquipe) {
        log.debug("REST request to get all TipoEquipes");
        return tipoEquipeRepository.findAllEquipesCompartilhaveis(idOrganizacao, idEquipe, idAnalise);
    }

    /**
     * DELETE /tipo-equipes/:id : delete the "id" tipoEquipe.
     *
     * @param id the id of the tipoEquipe to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/tipo-equipes/{id}")
    @Timed
    @Secured({ROLE_ADMIN, ROLE_USER, ROLE_GESTOR, ROLE_ANALISTA})
    public ResponseEntity<Void> deleteTipoEquipe(@PathVariable Long id) {
        log.debug("REST request to delete TipoEquipe : {}", id);

        tipoEquipeRepository.delete(id);
        tipoEquipeSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH /_search/tipo-equipes?query=:query : search for the tipoEquipe
     * corresponding to the query.
     *
     * @param query the query of the tipoEquipe search
     * @return the result of the search
     * @throws URISyntaxException
     */
    @GetMapping("/_search/tipo-equipes")
    @Timed
    public ResponseEntity<List<TipoEquipe>> searchTipoEquipes(@RequestParam(defaultValue = "*") String query, @RequestParam String order, @RequestParam(name = "page") int pageNumber, @RequestParam int size, @RequestParam(defaultValue = "id") String sort) throws URISyntaxException {
        log.debug("REST request to search for a page of TipoEquipes for query {}", query);

        Sort.Direction sortOrder = PageUtils.getSortDirection(order);
        Pageable newPageable = new PageRequest(pageNumber, size, sortOrder, sort);

        Page<TipoEquipe> page = tipoEquipeSearchRepository.search(queryStringQuery(query), newPageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/tipo-equipes");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @GetMapping(value = "/tipoEquipe/exportacao/{tipoRelatorio}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @Timed
    public ResponseEntity<InputStreamResource> gerarRelatorioExportacao(@PathVariable String tipoRelatorio, @RequestParam(defaultValue = "*") String query) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream;
        try {
            new NativeSearchQueryBuilder().withQuery(multiMatchQuery(query)).build();
            Page<TipoEquipe> result =  tipoEquipeSearchRepository.search(queryStringQuery(query), dynamicExportsService.obterPageableMaximoExportacao());
            byteArrayOutputStream = dynamicExportsService.export(new RelatorioEquipeColunas(), result, tipoRelatorio, Optional.empty(), Optional.ofNullable(AbacoUtil.REPORT_LOGO_PATH), Optional.ofNullable(AbacoUtil.getReportFooter()));
        } catch (DRException | ClassNotFoundException | JRException | NoClassDefFoundError e) {
            log.error(e.getMessage(), e);
            throw new RelatorioException(e);
        }
        return DynamicExporter.output(byteArrayOutputStream,
            "relatorio." + tipoRelatorio);
    }

    @GetMapping("/tipo-equipes/active-user")
    @Timed
    public List<DropdownDTO> findActiveUserTipoEquipes() {
        return tipoEquipeService.findActiveUserTipoEquipes();
    }
}
