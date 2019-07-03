package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.domain.FatorAjuste;
import br.com.basis.abaco.domain.FuncaoTransacao;
import br.com.basis.abaco.domain.Manual;
import br.com.basis.abaco.domain.ManualContrato;
import br.com.basis.abaco.repository.AnaliseRepository;
import br.com.basis.abaco.repository.FatorAjusteRepository;
import br.com.basis.abaco.repository.FuncaoTransacaoRepository;
import br.com.basis.abaco.repository.ManualContratoRepository;
import br.com.basis.abaco.repository.ManualRepository;
import br.com.basis.abaco.repository.search.ManualSearchRepository;
import br.com.basis.abaco.service.ManualService;
import br.com.basis.abaco.service.dto.DropdownDTO;
import br.com.basis.abaco.service.exception.RelatorioException;
import br.com.basis.abaco.service.relatorio.RelatorioManualColunas;
import br.com.basis.abaco.utils.AbacoUtil;
import br.com.basis.abaco.utils.PageUtils;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import br.com.basis.abaco.web.rest.util.PaginationUtil;
import br.com.basis.dynamicexports.service.DynamicExportsService;
import br.com.basis.dynamicexports.util.DynamicExporter;
import com.codahale.metrics.annotation.Timed;
import io.github.jhipster.web.util.ResponseUtil;
import net.sf.dynamicreports.report.exception.DRException;
import net.sf.jasperreports.engine.JRException;
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

import javax.validation.Valid;
import java.io.ByteArrayOutputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.multiMatchQuery;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * REST controller for managing Manual.
 */
@RestController
@RequestMapping("/api")
public class ManualResource {

    private final Logger log = LoggerFactory.getLogger(ManualResource.class);

    private static final String ENTITY_NAME = "manual";

    private final ManualRepository manualRepository;

    private final ManualContratoRepository manualContratoRepository;

    private final ManualSearchRepository manualSearchRepository;

    private final AnaliseRepository analiseRepository;

    private final FuncaoTransacaoRepository funcaoTransacaoRepository;

    private final FatorAjusteRepository fatorAjusteRepository;

    private final DynamicExportsService dynamicExportsService;

    private final ManualService manualService;

    private static final String ROLE_ANALISTA = "ROLE_ANALISTA";

    private static final String ROLE_ADMIN = "ROLE_ADMIN";

    private static final String ROLE_USER = "ROLE_USER";

    private static final String ROLE_GESTOR = "ROLE_GESTOR";

    private boolean status = false;

    public ManualResource(ManualRepository manualRepository, ManualSearchRepository manualSearchRepository, DynamicExportsService dynamicExportsService,
                          ManualContratoRepository manualContratoRepository, AnaliseRepository analiseRepository, FatorAjusteRepository fatorAjusteRepository,
                          FuncaoTransacaoRepository funcaoTransacaoRepository, ManualService manualService) {
        this.manualRepository = manualRepository;
        this.manualSearchRepository = manualSearchRepository;
        this.dynamicExportsService = dynamicExportsService;
        this.manualContratoRepository = manualContratoRepository;
        this.analiseRepository = analiseRepository;
        this.fatorAjusteRepository = fatorAjusteRepository;
        this.funcaoTransacaoRepository = funcaoTransacaoRepository;
        this.manualService = manualService;
    }

    /**
     * POST /manuals : Create a new manual.
     *
     * @param manual
     *            the manual to create
     * @return the ResponseEntity with status 201 (Created) and with body the new
     *         manual, or with status 400 (Bad Request) if the manual has already an
     *         ID
     * @throws URISyntaxException
     *             if the Location URI syntax is incorrect
     */
    @PostMapping("/manuals")
    @Timed
    @Secured({ROLE_ADMIN, ROLE_USER, ROLE_GESTOR, ROLE_ANALISTA})
    public ResponseEntity<Manual> createManual(@Valid @RequestBody Manual manual) throws URISyntaxException {
        log.debug("REST request to save Manual : {}", manual);
        if (manual.getId() != null) {
            return ResponseEntity.badRequest().headers(
                HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new manual cannot already have an ID"))
                .body(null);
        }

        Optional<Manual> existingManual = manualRepository.findOneByNome(manual.getNome());
        if (existingManual.isPresent()) {
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "manualexists", "Manual already in use"))
                .body(null);
        }

        Manual linkedManual = linkManualToPhaseEffortsAndAdjustFactors(manual);
        Manual result = manualRepository.save(linkedManual);
        manualSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/manuals/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString())).body(result);
    }

    private Manual linkManualToPhaseEffortsAndAdjustFactors(Manual manual) {

        Optional.ofNullable(manual.getEsforcoFases()).orElse(Collections.emptySet())
            .forEach(phaseEffort -> {
                phaseEffort.setManual(manual);
            });

        Optional.ofNullable(manual.getFatoresAjuste()).orElse(Collections.emptySet())
            .forEach(adjustFactor -> {
                adjustFactor.setManual(manual);
            });

        return manual;
    }

    /**
     * PUT /manuals : Updates an existing manual.
     *
     * @param manual
     *            the manual to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated
     *         manual, or with status 400 (Bad Request) if the manual is not valid,
     *         or with status 500 (Internal Server Error) if the manual couldnt be
     *         updated
     * @throws URISyntaxException
     *             if the Location URI syntax is incorrect
     */
    @PutMapping("/manuals")
    @Timed
    @Secured({ROLE_ADMIN, ROLE_USER, ROLE_GESTOR, ROLE_ANALISTA})
    public ResponseEntity<Manual> updateManual(@Valid @RequestBody Manual manual) throws URISyntaxException {
        log.debug("REST request to update Manual : {}", manual);
        if (manual.getId() == null) {
            return createManual(manual);
        }

        Optional<Manual> existingManual = manualRepository.findOneByNome(manual.getNome());
        if (existingManual.isPresent() && (!existingManual.get().getId().equals(manual.getId()))) {
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "manualexists", "Manual already in use"))
                .body(null);
        }

        Manual result = manualRepository.save(manual);
        manualSearchRepository.save(result);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, manual.getId().toString()))
            .body(result);
    }

    /**
     * GET /manuals : get all the manuals.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of manuals in
     *         body
     */
    @GetMapping("/manuals")
    @Timed
    public List<Manual> getAllManuals() {
        log.debug("REST request to get all Manuals");
        return manualRepository.findAll();
    }


    @GetMapping("/manuals/dropdown")
    @Timed
    public List<DropdownDTO> getManualsDropdown() {
        log.debug("REST request to get all Manuals Dropdown");
        return manualService.getManuaisDropdown();
    }

    /**
     * GET /manuals/:id : get the "id" manual.
     *
     * @param id
     *            the id of the manual to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the manual, or
     *         with status 404 (Not Found)
     */
    @GetMapping("/manuals/{id}")
    @Timed
    public ResponseEntity<Manual> getManual(@PathVariable Long id) {
        log.debug("REST request to get Manual : {}", id);
        Manual manual = manualRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(manual));
    }

    /**
     * DELETE /manuals/:id : delete the "id" manual.
     *
     * @param id
     *            the id of the manual to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/manuals/{id}")
    @Timed
    @Secured({ ROLE_ADMIN, ROLE_USER, ROLE_GESTOR, ROLE_ANALISTA })
    public ResponseEntity<String> deleteManual(@PathVariable Long id) {
        log.debug("REST request to delete Manual : {}", id);

        if (verificarManualContrato(id)) {
            return ResponseEntity.badRequest().body("contratoexists");
        }

        if (verificarAn(id)) {
            return ResponseEntity.badRequest().body("analiseexists");
        }
        if (verificarFt(id)) {
            return ResponseEntity.badRequest().body("fatorajusteexists");
        }

        manualRepository.delete(id);
        manualSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    private boolean verificarManualContrato(Long id) {
        status=false;
        List<ManualContrato> lstmanualContrato = manualContratoRepository.findAll();
        if (!lstmanualContrato.isEmpty()) {
            for (int i = 0; i < lstmanualContrato.size(); i++) {
                if (lstmanualContrato.get(i).getManual().getId().equals(id)) {
                    status=true;
                    return status;
                }
            }
        }
        return status;
    }

    private boolean verificarAn(Long id) {
        status = false;
        List<Analise> lstAnalise = analiseRepository.findAll();
        if (!lstAnalise.isEmpty()) {
            for (int i = 0; i < lstAnalise.size(); i++) {
                if (lstAnalise.get(i).getManual()!= null && lstAnalise.get(i).getManual().getId().equals(id)) {
                    status = true;
                    return status;
                }
            }
        }
        return status;
    }

    private boolean verificarFt(Long id) {
        status = false;
        List<FatorAjuste> lstFAjuste = fatorAjusteRepository.findAll();
        List<FuncaoTransacao> lstFt = funcaoTransacaoRepository.findAll();
        if (!lstFAjuste.isEmpty()) {
            for (int i = 0; i < lstFAjuste.size(); i++) {
                if (lstFAjuste.get(i).getManual()!=null && lstFAjuste.get(i).getManual().getId().equals(id)) {
                    for (int j = 0; j < lstFt.size(); j++) {
                        if (lstFt.get(j).getFatorAjuste()!=null && lstFt.get(j).getFatorAjuste().getId().equals(lstFAjuste.get(i).getId())) {
                            status = true;
                            return status;
                        }
                    }
                    fatorAjusteRepository.delete(lstFAjuste.get(i));
                }
            }
        }
        return status;
    }

    /**
     * SEARCH /_search/manuals?query=:query : search for the manual corresponding to
     * the query.
     *
     * @param query the query of the manual search
     * @return the result of the search
     * @throws URISyntaxException
     */
    @GetMapping("/_search/manual")
    @Timed
    public ResponseEntity<List<Manual>> searchManuals(@RequestParam(defaultValue = "*") String query, @RequestParam String order, @RequestParam(name="page") int pageNumber, @RequestParam int size, @RequestParam(defaultValue="id") String sort) throws URISyntaxException {
        log.debug("REST request to search Manuals for query {}", query);
        Sort.Direction sortOrder = PageUtils.getSortDirection(order);

        Pageable newPageable = new PageRequest(pageNumber, size, sortOrder, sort);
        Page<Manual> page = manualSearchRepository.search(queryStringQuery(query), newPageable);

        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/manual");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @GetMapping(value = "/manual/exportacao/{tipoRelatorio}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @Timed
    public ResponseEntity<InputStreamResource> gerarRelatorioExportacao(@PathVariable String tipoRelatorio, @RequestParam(defaultValue = "*") String query) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream;
        try {
            new NativeSearchQueryBuilder().withQuery(multiMatchQuery(query)).build();
            Page<Manual> result =  manualSearchRepository.search(queryStringQuery(query), dynamicExportsService.obterPageableMaximoExportacao());
            byteArrayOutputStream = dynamicExportsService.export(new RelatorioManualColunas(), result, tipoRelatorio, Optional.empty(), Optional.ofNullable(AbacoUtil.REPORT_LOGO_PATH), Optional.ofNullable(AbacoUtil.getReportFooter()));
        } catch (DRException | ClassNotFoundException | JRException | NoClassDefFoundError e) {
            log.error(e.getMessage(), e);
            throw new RelatorioException(e);
        }
        return DynamicExporter.output(byteArrayOutputStream,
            "relatorio." + tipoRelatorio);
    }

}
