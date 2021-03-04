package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.domain.FatorAjuste;
import br.com.basis.abaco.domain.FuncaoTransacao;
import br.com.basis.abaco.domain.Manual;
import br.com.basis.abaco.domain.ManualContrato;
import br.com.basis.abaco.domain.UploadedFile;
import br.com.basis.abaco.reports.rest.RelatorioFatorAjusteRest;
import br.com.basis.abaco.repository.AnaliseRepository;
import br.com.basis.abaco.repository.FatorAjusteRepository;
import br.com.basis.abaco.repository.FuncaoTransacaoRepository;
import br.com.basis.abaco.repository.ManualContratoRepository;
import br.com.basis.abaco.repository.ManualRepository;
import br.com.basis.abaco.repository.UploadedFilesRepository;
import br.com.basis.abaco.repository.search.ManualSearchRepository;
import br.com.basis.abaco.service.ManualService;
import br.com.basis.abaco.service.dto.DropdownDTO;
import br.com.basis.abaco.service.dto.ManualDTO;
import br.com.basis.abaco.service.dto.filter.SearchFilterDTO;
import br.com.basis.abaco.service.exception.RelatorioException;
import br.com.basis.abaco.service.relatorio.RelatorioManualColunas;
import br.com.basis.abaco.utils.AbacoUtil;
import br.com.basis.abaco.utils.PageUtils;
import br.com.basis.abaco.web.rest.errors.CustomParameterizedException;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import br.com.basis.abaco.web.rest.util.PaginationUtil;
import br.com.basis.dynamicexports.service.DynamicExportsService;
import br.com.basis.dynamicexports.util.DynamicExporter;
import com.codahale.metrics.annotation.Timed;
import io.github.jhipster.web.util.ResponseUtil;
import lombok.SneakyThrows;
import net.sf.dynamicreports.report.exception.DRException;
import net.sf.jasperreports.engine.JRException;
import org.apache.commons.beanutils.BeanUtils;
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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedList;
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

    private static final String MANUAL_EXISTS = "manualexists";
    private static final String MANUAL_IN_USE = "Manual already in use";

    private final ManualRepository manualRepository;

    private final ManualContratoRepository manualContratoRepository;

    private final ManualSearchRepository manualSearchRepository;

    private final AnaliseRepository analiseRepository;

    private final FuncaoTransacaoRepository funcaoTransacaoRepository;

    private final FatorAjusteRepository fatorAjusteRepository;

    private final DynamicExportsService dynamicExportsService;

    private final ManualService manualService;

    private final UploadedFilesRepository filesRepository;

<<<<<<< HEAD
    private static final String ROLE_ANALISTA = "ROLE_ANALISTA";

    private static final String ROLE_ADMIN = "ROLE_ADMIN";

    private static final String ROLE_USER = "ROLE_USER";

    private static final String ROLE_GESTOR = "ROLE_GESTOR";
=======
    private boolean status = false;
>>>>>>> Criar cadastro de perfil dinamicamente - BASIS-175045

    public ManualResource(ManualRepository manualRepository, ManualSearchRepository manualSearchRepository, DynamicExportsService dynamicExportsService,
                          ManualContratoRepository manualContratoRepository, AnaliseRepository analiseRepository, FatorAjusteRepository fatorAjusteRepository,
                          FuncaoTransacaoRepository funcaoTransacaoRepository, ManualService manualService, UploadedFilesRepository uploadedFilesRepository) {
        this.manualRepository = manualRepository;
        this.manualSearchRepository = manualSearchRepository;
        this.dynamicExportsService = dynamicExportsService;
        this.manualContratoRepository = manualContratoRepository;
        this.analiseRepository = analiseRepository;
        this.fatorAjusteRepository = fatorAjusteRepository;
        this.funcaoTransacaoRepository = funcaoTransacaoRepository;
        this.manualService = manualService;
        this.filesRepository = uploadedFilesRepository;
    }

    /**
     * POST /manuals : Create a new manual.
     *
     * @param manualDTO
     * @param files
     *            the manual to create
     * @return the ResponseEntity with status 201 (Created) and with body the new
     *         manual, or with status 400 (Bad Request) if the manual has already an
     *         ID
     * @throws URISyntaxException
     *             if the Location URI syntax is incorrect
     */
    @PostMapping(path = "/manuals", consumes = {"multipart/form-data"})
    @Timed
    @Secured("ROLE_ABACO_MANUAL_CADASTRAR")
    public ResponseEntity<Manual> createManual(@Valid @RequestPart("manual") ManualDTO manualDTO, @RequestPart("file") List<MultipartFile> files) throws URISyntaxException, InvocationTargetException, IllegalAccessException {

        Manual manual = manualDTO.toEntity();

        log.debug("REST request to save Manual : {}", manual);
        if (manual.getId() != null) {
            return ResponseEntity.badRequest().headers(
                HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new manual cannot already have an ID"))
                .body(null);
        }

        Optional<Manual> existingManual = manualRepository.findOneByNome(manual.getNome());
        if (existingManual.isPresent()) {
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(ENTITY_NAME, MANUAL_EXISTS, MANUAL_IN_USE))
                .body(null);
        }
        Manual linkedManual = linkManualToPhaseEffortsAndAdjustFactors(manual);
        List<UploadedFile> uploadedFiles = manualService.uploadFiles(files, linkedManual);
        for(UploadedFile file : uploadedFiles){
            linkedManual.addArquivoManual(file);
        }
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
     * @param manualDTO
     * @param files
     *            the manual to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated
     *         manual, or with status 400 (Bad Request) if the manual is not valid,
     *         or with status 500 (Internal Server Error) if the manual couldnt be
     *         updated
     * @throws URISyntaxException
     *             if the Location URI syntax is incorrect
     */
    @PutMapping(path = "/manuals", consumes = {"multipart/form-data"})
    @Timed
    @Secured("ROLE_ABACO_MANUAL_EDITAR")
    public ResponseEntity<Manual> updateManual(@Valid @RequestPart("manual") ManualDTO manualDTO, @RequestPart("file") List<MultipartFile> files) throws URISyntaxException, InvocationTargetException, IllegalAccessException {

        Manual manual = manualDTO.toEntity();

        log.debug("REST request to update Manual : {}", manual);
        if (manual.getId() == null) {
            return createManual(manualDTO, files);
        }

        Optional<Manual> existingManual = manualRepository.findOneByNome(manual.getNome());
        if (existingManual.isPresent() && (!existingManual.get().getId().equals(manual.getId()))) {
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(ENTITY_NAME, MANUAL_EXISTS, MANUAL_IN_USE))
                .body(null);
        }

        Optional<List<UploadedFile>> existingFiles = filesRepository.findAllByManuais(manual);
        if(existingFiles.isPresent()){
            manual.setArquivosManual(existingFiles.get());
        }

        List<UploadedFile> uploadedFiles = manualService.uploadFiles(files, manual);
        for(UploadedFile file : uploadedFiles){
            manual.addArquivoManual(file);
        }

        Manual linkedManual = linkManualToPhaseEffortsAndAdjustFactors(manual);
        Manual result = manualRepository.save(linkedManual);
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
    @Secured("ROLE_ABACO_MANUAL_ACESSAR")
    public List<Manual> getAllManuals() {
        log.debug("REST request to get all Manuals");
        return manualRepository.findAll();
    }


    @GetMapping("/manuals/dropdown")
    @Timed
    @Secured("ROLE_ABACO_MANUAL_ACESSAR")
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
    @Secured("ROLE_ABACO_MANUAL_CONSULTAR")
    public ResponseEntity<Manual> getManual(@PathVariable Long id) {
        log.debug("REST request to get Manual : {}", id);
        Manual manual = manualRepository.findOne(id);


        Optional<List<UploadedFile>> existingFiles = filesRepository.findAllByManuais(manual);
        if(existingFiles.isPresent()){
            manual.setArquivosManual(existingFiles.get());
        }

        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(manual));
    }

    /**
     * DELETE /manuals/:id : delete the "id" manual.
     *
     * @param id
     *            the id of the manual to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @SneakyThrows
    @DeleteMapping("/manuals/{id}")
    @Timed
    @Secured("ROLE_ABACO_MANUAL_EXCLUIR")
    public ResponseEntity<String> deleteManual(@PathVariable Long id) {

        if (verificarManualContrato(id)) {
            throw new CustomParameterizedException("ContratoRelacionado");
        } else if (verificarAn(id)) {
            throw new CustomParameterizedException("AnaliseRelacionada");
        } else if (verificarFt(id)) {
            throw new CustomParameterizedException("FatorDeAjusteRelacionado");
        } else {
            Manual manual = manualRepository.findOne(id);

            for (UploadedFile file : new LinkedList<UploadedFile>(manual.getArquivosManual())) {
                manual.removeArquivoManual(file);
                if (file.getManuais().isEmpty()) {
                    filesRepository.delete(file);
                }
            }

            manualRepository.delete(manual);

            manualSearchRepository.delete(manual);
        }
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * POST /manuals/clonar : Clone manual.
     *
     * @param manualDTO
     *
     * @return the ResponseEntity with status 201 (Created) and with body the new
     *         manual, or with status 400 (Bad Request) if the manual has already an
     *         ID
     * @throws URISyntaxException
     *             if the Location URI syntax is incorrect
     */
    @PostMapping("/manuals/clonar")
    @Timed
    @Secured("ROLE_ABACO_MANUAL_CLONAR")
    public ResponseEntity<Manual> clonar(@RequestBody ManualDTO manualDTO) throws InvocationTargetException, IllegalAccessException {

        Manual manual = manualDTO.toEntity();

        Optional<Manual> existingManual = manualRepository.findOneByNome(manual.getNome());
        if (existingManual.isPresent()) {
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(ENTITY_NAME, MANUAL_EXISTS, MANUAL_IN_USE))
                .body(null);
        }
        List<UploadedFile> files = new ArrayList<UploadedFile>();
        Optional<List<UploadedFile>> existingFiles = filesRepository.findAllByManuais(manual);
        if(existingFiles.isPresent()) {
            files.addAll(existingFiles.get());
        }

        manual.setId(null);
        Manual linkedManual = linkManualToPhaseEffortsAndAdjustFactors(manual);

        linkedManual.setArquivosManual(files);

        for(UploadedFile file : files){
            UploadedFile fileNew = new UploadedFile();
            BeanUtils.copyProperties(fileNew, file);
            fileNew.setManuais(Arrays.asList(linkedManual));
            filesRepository.save(fileNew);
        }

        Manual result = manualRepository.save(linkedManual);
        manualSearchRepository.save(result);

        return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, manual.getId().toString()))
            .body(result);
    }

    @GetMapping("/manuals/arquivos/{id}")
    @Secured("ROLE_ABACO_MANUAL_CONSULTAR")
    public List<UploadedFile> getFiles(@PathVariable Long id){
        Manual manual = manualRepository.findOne(id);

        Optional<List<UploadedFile>> existingFiles = filesRepository.findAllByManuais(manual);
        if(existingFiles.isPresent()){
            return existingFiles.get();
        }

        return Collections.emptyList();
    }

    private boolean verificarManualContrato(Long id) {
        boolean status=false;
        List<ManualContrato> listmanualContrato = manualContratoRepository.findAll();
        if (!listmanualContrato.isEmpty()) {
            for (ManualContrato obj : listmanualContrato) {
                if (obj.getManual().getId().equals(id)) {
                    status=true;
                    return status;
                }
            }
        }
        return status;
    }

    private boolean verificarAn(Long id) {
        boolean status = false;
        List<Analise> lstAnalise = analiseRepository.findAll();
        if (!lstAnalise.isEmpty()) {
            for (Analise obj : lstAnalise) {
                if (obj.getManual() != null && obj.getManual().getId().equals(id)) {
                    status = true;
                    return status;
                }
            }
        }
        return status;
    }

    private boolean verificarFt(Long id) {
        boolean status = false;
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
    @Secured({"ROLE_ABACO_MANUAL_ACESSAR", "ROLE_ABACO_MANUAL_PESQUISAR"})
    public ResponseEntity<List<Manual>> searchManuals(
        @RequestParam(defaultValue = "*") String query,
        @RequestParam(defaultValue = "ASC")String order,
        @RequestParam(name="page") int pageNumber,
        @RequestParam int size,
        @RequestParam(defaultValue="id", required = false) String sort) throws URISyntaxException {
        log.debug("REST request to search Manuals for query {}", query);
        Sort.Direction sortOrder = PageUtils.getSortDirection(order);

        Pageable newPageable = new PageRequest(pageNumber, size, sortOrder, sort);
        Page<Manual> page = manualSearchRepository.search(queryStringQuery(query), newPageable);

        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/manual");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @PostMapping(value = "/manual/exportacao/{tipoRelatorio}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @Timed
<<<<<<< HEAD
    public ResponseEntity<InputStreamResource> gerarRelatorioExportacao(@PathVariable String tipoRelatorio,@RequestBody SearchFilterDTO filter) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream = manualService.gerarRelatorio(filter, tipoRelatorio);
        return DynamicExporter.output(byteArrayOutputStream, "relatorio." + tipoRelatorio);
=======
    @Secured("ROLE_ABACO_MANUAL_EXPORTAR")
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
>>>>>>> Criar cadastro de perfil dinamicamente - BASIS-175045
    }

    @PostMapping(value = "/manual/exportacao-arquivo", produces = MediaType.APPLICATION_PDF_VALUE)
    @Timed
<<<<<<< HEAD
    public ResponseEntity<byte[]> gerarRelatorioImprimir(@RequestBody SearchFilterDTO filter)
        throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream = manualService.gerarRelatorio(filter, "pdf");
        return new ResponseEntity<byte[]>(byteArrayOutputStream.toByteArray(), HttpStatus.OK);
=======
    @Secured("ROLE_ABACO_MANUAL_EXPORTAR")
    public ResponseEntity<InputStreamResource> gerarRelatorio(@RequestParam(defaultValue = "*") String query) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream;
        try {
            new NativeSearchQueryBuilder().withQuery(multiMatchQuery(query)).build();
            Page<Manual> result = manualSearchRepository.findAll(dynamicExportsService.obterPageableMaximoExportacao());
            byteArrayOutputStream = dynamicExportsService.export(new RelatorioManualColunas(), result, "pdf", Optional.empty(), Optional.ofNullable(AbacoUtil.REPORT_LOGO_PATH), Optional.ofNullable(AbacoUtil.getReportFooter()));
        } catch (DRException | ClassNotFoundException | JRException | NoClassDefFoundError e) {
            throw new RelatorioException(e);
        }
        return DynamicExporter.output(byteArrayOutputStream, "Manuais_Ativos.pdf");
>>>>>>> Criar cadastro de perfil dinamicamente - BASIS-175045
    }

    @GetMapping("/relatorioPdfArquivoFatorAjuste/{id}")
    @Timed
    @Secured("ROLE_ABACO_MANUAL_EXPORTAR_FATOR_AJUSTE")
    public ResponseEntity<byte[]> downloadPdfBrowser(@PathVariable Long id) throws URISyntaxException, IOException, JRException {
        Manual manual = manualRepository.getOne(id);
        RelatorioFatorAjusteRest relatorioFatorAjusteRest = new RelatorioFatorAjusteRest();
        return relatorioFatorAjusteRest.gerarFatorAjustePDF(manual);
    }

}
