package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.domain.Compartilhada;
import br.com.basis.abaco.domain.FuncaoDados;
import br.com.basis.abaco.domain.FuncaoTransacao;
import br.com.basis.abaco.domain.Status;
import br.com.basis.abaco.domain.TipoEquipe;
import br.com.basis.abaco.domain.UploadedFile;
import br.com.basis.abaco.domain.User;
import br.com.basis.abaco.domain.enumeration.MetodoContagem;
import br.com.basis.abaco.domain.enumeration.StatusFuncao;
import br.com.basis.abaco.domain.enumeration.TipoRelatorio;
import br.com.basis.abaco.reports.rest.RelatorioAnaliseRest;
import br.com.basis.abaco.reports.util.RelatorioUtil;
import br.com.basis.abaco.repository.AnaliseRepository;
import br.com.basis.abaco.repository.CompartilhadaRepository;
import br.com.basis.abaco.repository.FuncaoDadosRepository;
import br.com.basis.abaco.repository.FuncaoTransacaoRepository;
import br.com.basis.abaco.repository.StatusRepository;
import br.com.basis.abaco.repository.TipoEquipeRepository;
import br.com.basis.abaco.repository.UploadedFilesRepository;
import br.com.basis.abaco.repository.UserRepository;
import br.com.basis.abaco.repository.search.AnaliseSearchRepository;
import br.com.basis.abaco.security.SecurityUtils;
import br.com.basis.abaco.service.AnaliseService;
import br.com.basis.abaco.service.PerfilService;
import br.com.basis.abaco.service.PlanilhaService;
import br.com.basis.abaco.service.dto.AnaliseDTO;
import br.com.basis.abaco.service.dto.AnaliseDivergenceEditDTO;
import br.com.basis.abaco.service.dto.AnaliseEditDTO;
import br.com.basis.abaco.service.dto.filter.AnaliseFilterDTO;
import br.com.basis.abaco.service.exception.RelatorioException;
import br.com.basis.abaco.service.relatorio.RelatorioAnaliseColunas;
import br.com.basis.abaco.service.relatorio.RelatorioDivergenciaColunas;
import br.com.basis.abaco.utils.AbacoUtil;
import br.com.basis.abaco.utils.PageUtils;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import br.com.basis.abaco.web.rest.util.PaginationUtil;
import br.com.basis.dynamicexports.service.DynamicExportsService;
import br.com.basis.dynamicexports.util.DynamicExporter;
import com.codahale.metrics.annotation.Timed;
import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;
import net.sf.dynamicreports.report.exception.DRException;
import net.sf.jasperreports.engine.JRException;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.search.sort.FieldSortBuilder;
import org.elasticsearch.search.sort.SortOrder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.SearchQuery;
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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static org.elasticsearch.index.query.QueryBuilders.multiMatchQuery;


@RestController
@RequestMapping("/api")
public class AnaliseResource {

    public static final String API_ANALISES = "/api/analises/";
    private final Logger log = LoggerFactory.getLogger(AnaliseResource.class);
    private static final String ENTITY_NAME = "analise";
    private static final String PAGE = "page";
    private final AnaliseRepository analiseRepository;
    private final UserRepository userRepository;
    private final AnaliseService analiseService;
    private final CompartilhadaRepository compartilhadaRepository;
    private final AnaliseSearchRepository analiseSearchRepository;
    private final FuncaoDadosRepository funcaoDadosRepository;
    private final StatusRepository statusRepository;
    private final FuncaoTransacaoRepository funcaoTransacaoRepository;
    private final DynamicExportsService dynamicExportsService;
    private final ElasticsearchTemplate elasticsearchTemplate;
    private static final String NOME_RELATORIO = "relatorio.";
    private final PerfilService perfilService;
    private HttpServletRequest request;
    private HttpServletResponse response;

    private RelatorioAnaliseRest relatorioAnaliseRest;
    @Autowired
    private TipoEquipeRepository tipoEquipeRepository;
    @Autowired
    private UploadedFilesRepository uploadedFilesRepository;

    @Autowired
    private PlanilhaService planilhaService;

    public AnaliseResource(AnaliseRepository analiseRepository,
                           AnaliseSearchRepository analiseSearchRepository,
                           DynamicExportsService dynamicExportsService,
                           UserRepository userRepository,
                           FuncaoDadosRepository funcaoDadosRepository,
                           CompartilhadaRepository compartilhadaRepository,
                           FuncaoTransacaoRepository funcaoTransacaoRepository,
                           ElasticsearchTemplate elasticsearchTemplate,
                           AnaliseService analiseService,
                           StatusRepository statusRepository, PerfilService perfilService) {
        this.analiseRepository = analiseRepository;
        this.analiseSearchRepository = analiseSearchRepository;
        this.dynamicExportsService = dynamicExportsService;
        this.userRepository = userRepository;
        this.compartilhadaRepository = compartilhadaRepository;
        this.funcaoDadosRepository = funcaoDadosRepository;
        this.funcaoTransacaoRepository = funcaoTransacaoRepository;
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.analiseService = analiseService;
        this.statusRepository = statusRepository;
        this.perfilService = perfilService;
    }

    @PostMapping("/analises")
    @Timed
    @Secured("ROLE_ABACO_ANALISE_CADASTRAR")
    public ResponseEntity<AnaliseEditDTO> createAnalise(@Valid @RequestBody Analise analise) throws URISyntaxException {
        if (analise.getId() != null) {
            return ResponseEntity.badRequest().headers(
                HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new analise cannot already have an ID")).body(null);
        }
        analise.setCreatedBy(userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get());
        analise.getUsers().add(analise.getCreatedBy());
        analiseService.salvaNovaData(analise);
        analiseRepository.save(analise);
        AnaliseEditDTO analiseEditDTO = analiseService.convertToAnaliseEditDTO(analise);
        analiseSearchRepository.save(analiseService.convertToEntity(analiseService.convertToDto(analise)));
        return ResponseEntity.created(new URI(API_ANALISES + analise.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, analise.getId().toString())).body(analiseEditDTO);
    }

    @PutMapping("/analises")
    @Timed
    @Secured("ROLE_ABACO_ANALISE_EDITAR")
    public ResponseEntity<AnaliseEditDTO> updateAnalise(@Valid @RequestBody Analise analiseUpdate) throws URISyntaxException {
        if (analiseUpdate.getId() == null) {
            return createAnalise(analiseUpdate);
        }
        Analise analise = analiseRepository.findOne(analiseUpdate.getId());
        analiseService.bindAnalise(analiseUpdate, analise);
        analiseService.updatePf(analise);
        if (analise.isBloqueiaAnalise()) {
            return ResponseEntity.badRequest().headers(
                HeaderUtil.createFailureAlert(ENTITY_NAME, "analiseblocked", "You cannot edit an blocked analise")).body(null);
        }
        analise.setEditedBy(analiseRepository.findOne(analise.getId()).getCreatedBy());
        analiseRepository.save(analise);
        AnaliseEditDTO analiseEditDTO = analiseService.convertToAnaliseEditDTO(analise);
        analise.setAnaliseClonadaParaEquipe(null);
        analiseSearchRepository.save(analiseService.convertToEntity(analiseService.convertToDto(analise)));
        return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, analise.getId().toString()))
            .body(analiseEditDTO);
    }

    @PutMapping("/analises/{id}/block")
    @Timed
    @Secured("ROLE_ABACO_ANALISE_BLOQUEAR_DESBLOQUEAR")
    public ResponseEntity<AnaliseEditDTO> blockUnblockAnalise(@PathVariable Long id, @Valid @RequestBody Analise analiseUpdate) throws URISyntaxException {
        log.debug("REST request to block Analise : {}", id);
        Analise analise = analiseService.recuperarAnalise(id);
        if (analise != null && !(analise.getDataHomologacao() == null && analiseUpdate.getDataHomologacao() == null)) {
            if (analise.getDataHomologacao() == null && analiseUpdate.getDataHomologacao() != null) {
                analise.setDataHomologacao(analiseUpdate.getDataHomologacao());
            }
            analiseService.linkFuncoesToAnalise(analise);
            analise.setBloqueiaAnalise(!analise.isBloqueiaAnalise());
            analiseRepository.save(analise);
            analise.setAnaliseClonadaParaEquipe(null);
            analiseSearchRepository.save(analiseService.convertToEntity(analiseService.convertToDto(analise)));
            return ResponseEntity.ok().headers(HeaderUtil.blockEntityUpdateAlert(ENTITY_NAME, analise.getId().toString())).body(analiseService.convertToAnaliseEditDTO(analise));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new AnaliseEditDTO());
        }
    }

    @GetMapping("/analises/clonar/{id}")
    @Timed
    @Secured("ROLE_ABACO_ANALISE_CLONAR")
    public ResponseEntity<AnaliseEditDTO> cloneAnalise(@PathVariable Long id) {
        Analise analise = analiseService.recuperarAnalise(id);
        if (analise.getId() != null) {
            User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();
            Analise analiseClone = new Analise(analise, user);
            analiseClone.setIdentificadorAnalise(analise.getIdentificadorAnalise() + " - CÓPIA");
            analiseService.bindCloneAnalise(analiseClone, analise, user);
            analiseRepository.save(analiseClone);
            analiseSearchRepository.save(analiseService.convertToEntity(analiseService.convertToDto(analiseClone)));
            return ResponseEntity.ok().headers(HeaderUtil.blockEntityUpdateAlert(ENTITY_NAME, analiseClone.getId().toString()))
                .body(analiseService.convertToAnaliseEditDTO(analiseClone));
        } else {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(new AnaliseEditDTO());
        }
    }

    @GetMapping("/analises/clonar/{id}/{idEquipe}")
    @Timed
    @Secured("ROLE_ABACO_ANALISE_CLONAR_EQUIPE")
    public ResponseEntity<AnaliseEditDTO> cloneAnaliseToEquipe(@PathVariable Long id, @PathVariable Long idEquipe) {
        Analise analise = analiseService.recuperarAnalise(id);
        TipoEquipe tipoEquipe = tipoEquipeRepository.findById(idEquipe);
        if (analise.getId() != null && tipoEquipe.getId() != null && !(analise.getClonadaParaEquipe())) {
            Analise analiseClone = new Analise(analise, userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get());
            analiseService.bindAnaliseCloneForTipoEquipe(analise, tipoEquipe, analiseClone);
            analiseRepository.save(analiseClone);
            analiseSearchRepository.save(analiseService.convertToEntity(analiseService.convertToDto(analiseClone)));
            analise.setClonadaParaEquipe(true);
            analise.setAnaliseClonou(true);
            analise.setAnaliseClonadaParaEquipe(analiseClone);
            analiseRepository.save(analise);
            analiseClone.setAnaliseClonadaParaEquipe(null);
            analiseSearchRepository.save(analiseService.convertToEntity(analiseService.convertToDto(analise)));
            return ResponseEntity.ok().headers(HeaderUtil.blockEntityUpdateAlert(ENTITY_NAME, analiseClone.getId().toString()))
                .body(analiseService.convertToAnaliseEditDTO(analiseClone));
        } else {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(new AnaliseEditDTO());
        }
    }

    @GetMapping("/analises/{id}")
    @Timed
    @Secured({"ROLE_ABACO_ANALISE_CONSULTAR", "ROLE_ABACO_ANALISE_EDITAR"})
    public ResponseEntity<AnaliseEditDTO> getAnalise(@PathVariable Long id) {
        Analise analise = analiseService.recuperarAnalise(id);
        if (analise != null) {
            User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();
            if (analiseService.permissionToEdit(user, analise)) {
                AnaliseEditDTO analiseEditDTO = analiseService.convertToAnaliseEditDTO(analise);
                return ResponseUtil.wrapOrNotFound(Optional.ofNullable(analiseEditDTO));
            }
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);

    }

    @GetMapping("/analises/view/{id}")
    @Timed
    public ResponseEntity<AnaliseEditDTO> getAnaliseView(@PathVariable Long id) {
        Analise analise = analiseService.recuperarAnalise(id);
        if (analise != null) {
            return ResponseUtil.wrapOrNotFound(Optional.ofNullable(analiseService.convertToAnaliseEditDTO(analise)));
        }
        return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(null);

    }

    @GetMapping("/analises/baseline")
    @Timed
    public List<Analise> getAllAnalisesBaseline(@RequestParam(value = "sistema", required = true) String sistema) {
        return analiseRepository.findAllByBaseline();
    }

    @DeleteMapping("/analises/{id}")
    @Timed
    @Secured("ROLE_ABACO_ANALISE_EXCLUIR")
    public ResponseEntity<Void> deleteAnalise(@PathVariable Long id) {

        Analise analise = analiseService.recuperarAnalise(id);
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();
        if (analise != null) {
            if (user.getOrganizacoes().contains(analise.getOrganizacao()) && user.getTipoEquipes().contains(analise.getEquipeResponsavel())) {
                if (analise.getAnaliseClonadaParaEquipe() != null) {
                    Analise analiseClonada = analiseService.recuperarAnalise(analise.getAnaliseClonadaParaEquipe().getId());
                    analise.setAnaliseClonadaParaEquipe(null);
                    analiseClonada.setAnaliseClonadaParaEquipe(null);
                    analiseClonada.setAnaliseClonou(false);
                    analiseClonada.setClonadaParaEquipe(false);
                    analiseRepository.save(analiseClonada);
                    analiseSearchRepository.save(analiseService.convertToEntity(analiseService.convertToDto(analiseClonada)));
                }
                analiseRepository.delete(id);
                analiseSearchRepository.delete(id);
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @GetMapping("/compartilhada/{idAnalise}")
    @Timed
    public List<Compartilhada> getAllCompartilhadaByAnalise(@PathVariable Long idAnalise) {
        return compartilhadaRepository.findAllByAnaliseId(idAnalise);
    }

    @PostMapping("/analises/compartilhar")
    @Timed
    @Secured("ROLE_ABACO_ANALISE_COMPARTILHAR")
    public ResponseEntity<Set<Compartilhada>> popularCompartilhar(@Valid @RequestBody Set<Compartilhada> compartilhadaList) throws URISyntaxException {
        compartilhadaList.forEach(compartilhada -> {
            compartilhadaRepository.save(compartilhada);
        });
        analiseService.saveAnaliseCompartilhada(compartilhadaList);
        return ResponseEntity.created(new URI("/api/analises/compartilhar"))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, "created")).body(compartilhadaList);
    }

    @DeleteMapping("/analises/compartilhar/delete/{id}")
    @Timed
    @Secured("ROLE_ABACO_ANALISE_COMPARTILHAR")
    public ResponseEntity<Void> deleteCompartilharAnalise(@PathVariable Long id) {
        Compartilhada compartilhada = compartilhadaRepository.getOne(id);
        Analise analise = analiseRepository.getOne(compartilhada.getAnaliseId());
        analise.getCompartilhadas().remove(compartilhada);
        analiseRepository.save(analise);
        analise.setAnaliseClonadaParaEquipe(null);
        analiseSearchRepository.save(analiseService.convertToEntity(analiseService.convertToDto(analise)));
        compartilhadaRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @PutMapping("/analises/compartilhar/viewonly/{id}")
    @Timed
    @Secured("ROLE_ABACO_ANALISE_COMPARTILHAR")
    public ResponseEntity<Compartilhada> viewOnly(@Valid @RequestBody Compartilhada compartilhada) throws URISyntaxException {
        Compartilhada result = compartilhadaRepository.save(compartilhada);

        return ResponseEntity.ok().headers(HeaderUtil.blockEntityUpdateAlert(ENTITY_NAME, compartilhada.getId().toString()))
            .body(result);
    }


    @GetMapping("/relatorioPdfArquivo/{id}")
    @Timed
    @Secured("ROLE_ABACO_ANALISE_EXPORTAR")
    public ResponseEntity<byte[]> downloadPdfArquivo(@PathVariable Long id) throws URISyntaxException, IOException, JRException {
        Analise analise = analiseService.recuperarAnalise(id);
        relatorioAnaliseRest = new RelatorioAnaliseRest(this.response, this.request);
        return relatorioAnaliseRest.downloadPdfArquivo(analise, TipoRelatorio.ANALISE);
    }

    @GetMapping("/divergencia/relatorioPdfArquivo/{id}")
    @Timed
    @Secured("ROLE_ABACO_VALIDACAO_EXPORTAR")
    public ResponseEntity<byte[]> downloadDivergenciaPdfArquivo(@PathVariable Long id) throws URISyntaxException, IOException, JRException {
        Analise analise = analiseService.recuperarAnalise(id);
        relatorioAnaliseRest = new RelatorioAnaliseRest(this.response, this.request);
        return relatorioAnaliseRest.downloadPdfArquivo(analise, TipoRelatorio.ANALISE);
    }

    @GetMapping("/relatorioPdfBrowser/{id}")
    @Timed
    @Secured("ROLE_ABACO_ANALISE_EXPORTAR")
    public @ResponseBody
    ResponseEntity<byte[]> downloadPdfBrowser(@PathVariable Long id) throws URISyntaxException, IOException, JRException {
        Analise analise = analiseService.recuperarAnalise(id);
        relatorioAnaliseRest = new RelatorioAnaliseRest(this.response, this.request);
        return relatorioAnaliseRest.downloadPdfBrowser(analise, TipoRelatorio.ANALISE);
    }

    @GetMapping("/downloadPdfDetalhadoBrowser/{id}")
    @Timed
    @Secured("ROLE_ABACO_ANALISE_EXPORTAR_RELATORIO_DETALHADO")
    public @ResponseBody
    ResponseEntity<byte[]> downloadPdfDetalhadoBrowser(@PathVariable Long id) throws URISyntaxException, IOException, JRException {
        Analise analise = analiseService.recuperarAnalise(id);
        analise.setFuncaoDados(funcaoDadosRepository.findAllByAnaliseIdOrderByOrdem(id));
        analise.setFuncaoTransacaos(funcaoTransacaoRepository.findAllByAnaliseIdOrderByOrdem(id));
        relatorioAnaliseRest = new RelatorioAnaliseRest(this.response, this.request);
        return relatorioAnaliseRest.downloadPdfBrowser(analise, TipoRelatorio.ANALISE_DETALHADA);
    }

    @GetMapping("/divergencia/downloadPdfDetalhadoBrowser/{id}")
    @Timed
    @Secured("ROLE_ABACO_VALIDACAO_EXPORTAR")
    public @ResponseBody
    ResponseEntity<byte[]> downloadPdfDivergenciaDetalhadoBrowser(@PathVariable Long id) throws URISyntaxException, IOException, JRException {
        Analise analise = analiseService.recuperarAnalise(id);
        analise.setFuncaoDados(funcaoDadosRepository.findByAnaliseIdAndStatusFuncaoOrderByOrdem(id, StatusFuncao.VALIDADO));
        analise.setFuncaoTransacaos(funcaoTransacaoRepository.findByAnaliseIdAndStatusFuncaoOrderByOrdem(id, StatusFuncao.VALIDADO));
        relatorioAnaliseRest = new RelatorioAnaliseRest(this.response, this.request);
        return relatorioAnaliseRest.downloadPdfBrowser(analise, TipoRelatorio.ANALISE_DETALHADA);
    }

    @GetMapping("/downloadRelatorioExcel/{id}")
    @Timed
    @Secured("ROLE_ABACO_ANALISE_EXPORTAR_RELATORIO_EXCEL")
    public @ResponseBody
    ResponseEntity<byte[]> downloadRelatorioExcel(@PathVariable Long id) throws URISyntaxException, IOException, JRException {
        Analise analise = analiseService.recuperarAnalise(id);
        analise.setFuncaoDados(funcaoDadosRepository.findAllByAnaliseIdOrderByOrdem(id));
        analise.setFuncaoTransacaos(funcaoTransacaoRepository.findAllByAnaliseIdOrderByOrdem(id));
        relatorioAnaliseRest = new RelatorioAnaliseRest(this.response, this.request);
        Long idLogo = analise.getOrganizacao().getLogoId();
        UploadedFile uploadedFiles = new UploadedFile();
        if (idLogo != null && idLogo > 0) {
            uploadedFiles = uploadedFilesRepository.findOne(idLogo);
        }
        return relatorioAnaliseRest.downloadExcel(analise, uploadedFiles);
    }

    @GetMapping("/divergencia/downloadRelatorioExcel/{id}")
    @Timed
    @Secured("ROLE_ABACO_VALIDACAO_EXPORTAR")
    public @ResponseBody
    ResponseEntity<byte[]> downloadDivergenciaRelatorioExcel(@PathVariable Long id) throws URISyntaxException, IOException, JRException {
        Analise analise = analiseService.recuperarAnalise(id);
        analise.setFuncaoDados(funcaoDadosRepository.findByAnaliseIdAndStatusFuncaoOrderByOrdem(id, StatusFuncao.VALIDADO));
        analise.setFuncaoTransacaos(funcaoTransacaoRepository.findByAnaliseIdAndStatusFuncaoOrderByOrdem(id, StatusFuncao.VALIDADO));
        relatorioAnaliseRest = new RelatorioAnaliseRest(this.response, this.request);
        Long idLogo = analise.getOrganizacao().getLogoId();
        UploadedFile uploadedFiles = new UploadedFile();
        if (idLogo != null && idLogo > 0) {
            uploadedFiles = uploadedFilesRepository.findOne(idLogo);
        }
        return relatorioAnaliseRest.downloadExcel(analise, uploadedFiles);
    }

    @GetMapping("/relatorioContagemPdf/{id}")
    @Timed
    @Secured("ROLE_ABACO_ANALISE_EXPORTAR_RELATORIO_FUNDAMENTACAO")
    public @ResponseBody
    ResponseEntity<InputStreamResource> gerarRelatorioContagemPdf(@PathVariable Long id) throws IOException, JRException {
        Analise analise = analiseService.recuperarAnaliseContagem(id);
        analise.setFuncaoDados(funcaoDadosRepository.findAllByAnaliseIdOrderByOrdem(id));
        analise.setFuncaoTransacaos(funcaoTransacaoRepository.findAllByAnaliseIdOrderByOrdem(id));
        relatorioAnaliseRest = new RelatorioAnaliseRest(this.response, this.request);
        return relatorioAnaliseRest.downloadReportContagem(analise);
    }

    @GetMapping(value = "/analise/exportaPdf", produces = MediaType.APPLICATION_PDF_VALUE)
    @Timed
    @Secured("ROLE_ABACO_ANALISE_EXPORTAR")
    public ResponseEntity<InputStreamResource> gerarRelatorioPdf(@RequestParam(defaultValue = "*") String query) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream;
        try {
            new NativeSearchQueryBuilder().withQuery(multiMatchQuery(query)).build();
            Page<Analise> result = analiseSearchRepository.findAll(dynamicExportsService.obterPageableMaximoExportacao());
            byteArrayOutputStream = dynamicExportsService.export(new RelatorioAnaliseColunas(null), result, "pdf", Optional.empty(),
                Optional.ofNullable(AbacoUtil.REPORT_LOGO_PATH),
                Optional.ofNullable(AbacoUtil.getReportFooter()));
        } catch (DRException | ClassNotFoundException | JRException | NoClassDefFoundError e) {
            throw new RelatorioException(e);
        }
        return DynamicExporter.output(byteArrayOutputStream, "relatorio" + "pdf");
    }

    @PostMapping(value = "/analise/exportacao/{tipoRelatorio}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @Timed
    @Secured("ROLE_ABACO_ANALISE_EXPORTAR")
    public ResponseEntity<InputStreamResource> gerarRelatorioExportacao(@PathVariable String tipoRelatorio,
                                                                        @RequestBody AnaliseFilterDTO filter) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream;
        try {
            Page<Analise> page = elasticsearchTemplate.queryForPage(analiseService.getQueryExportRelatorio(filter, dynamicExportsService.obterPageableMaximoExportacao()), Analise.class);
            byteArrayOutputStream = dynamicExportsService.export(new RelatorioAnaliseColunas(filter.getColumnsVisible()), page, tipoRelatorio, Optional.empty(), Optional.ofNullable(AbacoUtil.REPORT_LOGO_PATH), Optional.ofNullable(AbacoUtil.getReportFooter()));
        } catch (DRException | ClassNotFoundException | JRException | NoClassDefFoundError e) {
            log.error(e.getMessage(), e);
            throw new RelatorioException(e);
        }
        return DynamicExporter.output(byteArrayOutputStream,
            NOME_RELATORIO + tipoRelatorio);
    }


    @PostMapping(value = "/analise/exportacao-arquivo", produces = MediaType.APPLICATION_PDF_VALUE)
    @Timed
    @Secured("ROLE_ABACO_ANALISE_EXPORTAR")
    public ResponseEntity<byte[]> gerarRelatorioAnaliseImprimir(@RequestBody AnaliseFilterDTO filter) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream;
        try {
            Page<Analise> page = elasticsearchTemplate.queryForPage(analiseService.getQueryExportRelatorio(filter, dynamicExportsService.obterPageableMaximoExportacao()), Analise.class);
            byteArrayOutputStream = dynamicExportsService.export(new RelatorioAnaliseColunas(filter.getColumnsVisible()), page, "pdf", Optional.empty(), Optional.ofNullable(AbacoUtil.REPORT_LOGO_PATH), Optional.ofNullable(AbacoUtil.getReportFooter()));
        } catch (DRException | ClassNotFoundException | JRException | NoClassDefFoundError e) {
            throw new RelatorioException(e);
        }
        return new ResponseEntity<byte[]>(byteArrayOutputStream.toByteArray(), HttpStatus.OK);
    }


    @PostMapping(value = "/divergencia/exportacao-arquivo", produces = MediaType.APPLICATION_PDF_VALUE)
    @Timed
    @Secured("ROLE_ABACO_VALIDACAO_EXPORTAR")
    public ResponseEntity<byte[]> gerarRelatorioDivergenciaImprimir(@RequestBody AnaliseFilterDTO filter, @ApiParam Pageable pageable) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream = gerarRelatorioDivergencia("pdf", filter, dynamicExportsService.obterPageableMaximoExportacao());
        return new ResponseEntity<byte[]>(byteArrayOutputStream.toByteArray(), HttpStatus.OK);
    }


    @PostMapping(value = "/divergencia/exportacao/{tipoRelatorio}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @Timed
    @Secured("ROLE_ABACO_VALIDACAO_EXPORTAR")
    public ResponseEntity<InputStreamResource> gerarRelatorioDivergenciaExportacao(@PathVariable String tipoRelatorio,
                                                                                   @RequestBody AnaliseFilterDTO filter, @ApiParam Pageable pageable) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream = gerarRelatorioDivergencia(tipoRelatorio, filter, dynamicExportsService.obterPageableMaximoExportacao());
        return DynamicExporter.output(byteArrayOutputStream, NOME_RELATORIO + tipoRelatorio);
    }


    private ByteArrayOutputStream gerarRelatorioDivergencia(String tipoRelatorio, AnaliseFilterDTO filter, Pageable pageable)
        throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream;
        try {
            pageable = dynamicExportsService.obterPageableMaximoExportacao();
            Page<Analise> page = elasticsearchTemplate.queryForPage(analiseService.getQueryExportRelatorioDivergencia(filter, pageable), Analise.class);
            byteArrayOutputStream = dynamicExportsService.export(new RelatorioDivergenciaColunas(), page, tipoRelatorio,
                Optional.empty(), Optional.ofNullable(AbacoUtil.REPORT_LOGO_PATH),
                Optional.ofNullable(AbacoUtil.getReportFooter()));
        } catch (DRException | ClassNotFoundException | JRException | NoClassDefFoundError e) {
            throw new RelatorioException(e);
        }
        return byteArrayOutputStream;
    }


    @GetMapping("/analises")
    @Timed
    @Secured("ROLE_ABACO_ANALISE_ACESSAR")
    public ResponseEntity<List<AnaliseDTO>> getAllAnalisesEquipes(@RequestParam(defaultValue = "ASC", required = false) String order,
                                                                  @RequestParam(defaultValue = "0", name = PAGE) int pageNumber,
                                                                  @RequestParam(defaultValue = "20") int size,
                                                                  @RequestParam(defaultValue = "id") String sort,
                                                                  @RequestParam(value = "identificadorAnalise", required = false) String identificador,
                                                                  @RequestParam(value = "sistema", required = false) Set<Long> sistema,
                                                                  @RequestParam(value = "metodoContagem", required = false) Set<MetodoContagem> metodo,
                                                                  @RequestParam(value = "organizacao", required = false) Set<Long> organizacao,
                                                                  @RequestParam(value = "equipe", required = false) Long equipe,
                                                                  @RequestParam(value = "status", required = false) Set<Long> status,
                                                                  @RequestParam(value = "usuario", required = false) Set<Long> usuario)
        throws URISyntaxException {
        log.debug("DEBUG Consulta Analises - Inicio metodo");
        Sort.Direction sortOrder = PageUtils.getSortDirection(order);
        Pageable pageable = new PageRequest(pageNumber, size, sortOrder, sort);
        FieldSortBuilder sortBuilder = new FieldSortBuilder(sort).order(SortOrder.ASC);
        BoolQueryBuilder qb = analiseService.getBoolQueryBuilder(identificador, sistema, metodo, organizacao, equipe, usuario, status);
        SearchQuery searchQuery = new NativeSearchQueryBuilder().withQuery(qb).withPageable(dynamicExportsService.obterPageableMaximoExportacao()).withSort(sortBuilder).build();
        Page<Analise> page = elasticsearchTemplate.queryForPage(searchQuery, Analise.class);
        log.debug("DEBUG Consulta Analises -  Consulta realizada");
        Page<AnaliseDTO> dtoPage = page.map(analise -> analiseService.convertToDto(analise));
        Page<AnaliseDTO> newDTOPage = perfilService.validarPerfilAnalise(dtoPage, pageable, false);
        log.debug("DEBUG Consulta Analises -  Conversão realizada");
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(newDTOPage, API_ANALISES);
        return new ResponseEntity<>(newDTOPage.getContent(), headers, HttpStatus.OK);
    }

    @GetMapping("/analises/update-pf/{id}")
    @Timed
    @Secured("ROLE_ABACO_ANALISE_EDITAR")
    public ResponseEntity<AnaliseEditDTO> updateSomaPf(@PathVariable Long id) {
        Analise analise = analiseService.recuperarAnalise(id);
        if (analise.getId() != null) {
            analiseService.updatePf(analise);
            analiseRepository.save(analise);
            analise.setAnaliseClonadaParaEquipe(null);
            analiseSearchRepository.save(analiseService.convertToEntity(analiseService.convertToDto(analise)));
            return ResponseEntity.ok().headers(HeaderUtil.blockEntityUpdateAlert(ENTITY_NAME, analise.getId().toString()))
                .body(analiseService.convertToAnaliseEditDTO(analise));
        } else {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(new AnaliseEditDTO());
        }
    }


    @GetMapping("/analises/update-divergente-pf/{id}")
    @Timed
    @Secured("ROLE_ABACO_ANALISE_EDITAR")
    public ResponseEntity<AnaliseEditDTO> updateSomaDivergentePf(@PathVariable Long id) {
        Analise analise = analiseService.recuperarAnalise(id);
        if (analise.getId() != null) {
            analiseService.updatePFDivergente(analise);
            analiseRepository.save(analise);
            analise.setAnaliseClonadaParaEquipe(null);
            analiseSearchRepository.save(analiseService.convertToEntity(analiseService.convertToDto(analise)));
            return ResponseEntity.ok().headers(HeaderUtil.blockEntityUpdateAlert(ENTITY_NAME, analise.getId().toString()))
                .body(analiseService.convertToAnaliseEditDTO(analise));
        } else {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(new AnaliseEditDTO());
        }
    }

    @GetMapping("/analises/change-status/{id}/{idStatus}")
    @Timed
    @Secured("ROLE_ABACO_ANALISE_ALTERAR_STATUS")
    public ResponseEntity<AnaliseEditDTO> alterStatusAnalise(@PathVariable Long id, @PathVariable Long idStatus) {
        Analise analise = analiseService.recuperarAnalise(id);
        Status status = statusRepository.findById(idStatus);
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();
        if (analise.getId() != null && status.getId() != null && analiseService.changeStatusAnalise(analise, status, user)) {
            analiseRepository.save(analise);
            analise.setAnaliseClonadaParaEquipe(null);
            analiseSearchRepository.save(analiseService.convertToEntity(analiseService.convertToDto(analise)));
            return ResponseEntity.ok().headers(HeaderUtil.blockEntityUpdateAlert(ENTITY_NAME, analise.getId().toString()))
                .body(analiseService.convertToAnaliseEditDTO(analise));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new AnaliseEditDTO());
        }
    }

    @GetMapping("/analises/divergencia/{idAnaliseComparada}")
    @Timed
    @Secured("ROLE_ABACO_ANALISE_GERAR_VALIDACAO")
    public ResponseEntity<AnaliseEditDTO> gerarDivergencia(@PathVariable Long idAnaliseComparada) {
        Analise analise = analiseRepository.findOne(idAnaliseComparada);
        Status status = statusRepository.findFirstByDivergenciaTrue();
        if (status == null || status.getId() == null) {
            ResponseEntity.status(HttpStatus.FORBIDDEN).body("Error status");
        }
        if (analise == null || analise.getId() == null) {
            ResponseEntity.status(HttpStatus.FORBIDDEN).body("Error analise");
        }
        Analise analiseDivergencia = analiseService.generateDivergence(analise, status);
        return ResponseEntity.ok(analiseService.convertToAnaliseEditDTO(analiseDivergencia));
    }

    @GetMapping("/analises/gerar-divergencia/{idAnalisePadao}/{idAnaliseComparada}")
    @Timed
    @Secured("ROLE_ABACO_ANALISE_GERAR_VALIDACAO")
    public ResponseEntity<AnaliseEditDTO> gerarDivergencia(@PathVariable Long idAnalisePadao, @PathVariable Long idAnaliseComparada, @RequestParam(value = "isUnion", defaultValue = "false") boolean isUnionFunction) {
        Analise analisePadrão = analiseRepository.findOne(idAnalisePadao);
        Analise analiseComparada = analiseRepository.findOne(idAnaliseComparada);
        Status status = statusRepository.findFirstByDivergenciaTrue();
        if (status == null || status.getId() == null) {
            ResponseEntity.status(HttpStatus.FORBIDDEN).body("Error Status");
        }
        if (analisePadrão == null || analisePadrão.getId() == null) {
            ResponseEntity.status(HttpStatus.FORBIDDEN).body("Error analise Padrão");
        }
        if (analiseComparada == null || analiseComparada.getId() == null) {
            ResponseEntity.status(HttpStatus.FORBIDDEN).body("Error analise Comparada");
        }
        Analise analiseDivergencia = analiseService.generateDivergence(analisePadrão, analiseComparada, status, isUnionFunction);
        return ResponseEntity.ok(analiseService.convertToAnaliseEditDTO(analiseDivergencia));
    }

    @GetMapping("/analises/divergente/update/{id}")
    @Timed
    @Secured("ROLE_ABACO_VALIDACAO_EDITAR")
    public ResponseEntity<AnaliseEditDTO> updateAnaliseDivergene(@PathVariable Long id) {
        Analise analise = analiseRepository.findOne(id);
        if (analise == null || analise.getId() == null) {
            ResponseEntity.status(HttpStatus.FORBIDDEN).body("Error analise Padrão");
        }
        analise = analiseService.updateDivergenceAnalise(analise);
        return ResponseEntity.ok(analiseService.convertToAnaliseEditDTO(analise));
    }

    @GetMapping("/divergencia")
    @Timed
    @Secured({"ROLE_ABACO_VALIDACAO_ACESSAR", "ROLE_ABACO_VALIDACAO_PESQUISAR"})
    public ResponseEntity<List<AnaliseDTO>> getDivergence(@RequestParam(defaultValue = "ASC", required = false) String order,
                                                          @RequestParam(defaultValue = "0", name = PAGE) int pageNumber,
                                                          @RequestParam(defaultValue = "20") int size,
                                                          @RequestParam(defaultValue = "id") String sort,
                                                          @RequestParam(value = "identificador", required = false) String identificador,
                                                          @RequestParam(value = "sistema", required = false) Set<Long> sistema,
                                                          @RequestParam(value = "organizacao", required = false) Set<Long> organizacao)
        throws URISyntaxException {
        log.debug("DEBUG Consulta Validação -  Inicio método");
        Sort.Direction sortOrder = PageUtils.getSortDirection(order);
        Pageable pageable = new PageRequest(pageNumber, size, sortOrder, sort);
        FieldSortBuilder sortBuilder = new FieldSortBuilder(sort).order(SortOrder.ASC);
        BoolQueryBuilder qb = analiseService.getBoolQueryBuilderDivergence(identificador, sistema, organizacao);
        SearchQuery searchQuery = new NativeSearchQueryBuilder().withQuery(qb).withPageable(dynamicExportsService.obterPageableMaximoExportacao()).withSort(sortBuilder).build();
        Page<Analise> page = elasticsearchTemplate.queryForPage(searchQuery, Analise.class);
        log.debug("DEBUG Consulta Validação -  Consulta realizada");
        Page<AnaliseDTO> dtoPage = page.map(analise -> analiseService.convertToDto(analise));

        Page<AnaliseDTO> newDTOPage = perfilService.validarPerfilAnalise(dtoPage, pageable, true);
        log.debug("DEBUG Consulta Validação -  Conversão realizada");
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(newDTOPage, API_ANALISES);
        return new ResponseEntity<>(newDTOPage.getContent(), headers, HttpStatus.OK);
    }


    @GetMapping("/divergencia/{id}")
    @Timed
    @Secured({"ROLE_ABACO_VALIDACAO_CONSULTAR", "ROLE_ABACO_VALIDACAO_EDITAR"})
    public ResponseEntity<AnaliseDivergenceEditDTO> getDivergence(@PathVariable Long id) {
        Analise analise = analiseService.recuperarAnaliseDivergence(id);
        if (analise != null) {
            User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).orElse(new User());
            if (user.getOrganizacoes().contains(analise.getOrganizacao())) {
                AnaliseDivergenceEditDTO analiseDivergenceEditDTO = analiseService.convertToAnaliseDivergenceEditDTO(analise);
                return ResponseUtil.wrapOrNotFound(Optional.ofNullable(analiseDivergenceEditDTO));
            }
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
    }


    @DeleteMapping("/divergencia/{id}")
    @Timed
    @Secured("ROLE_ABACO_VALIDACAO_EXCLUIR")
    public ResponseEntity<Void> deleteAnaliseDivergence(@PathVariable Long id) {
        Analise analise = analiseService.recuperarAnalise(id);
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();
        if (analise != null) {
            if (user.getOrganizacoes().contains(analise.getOrganizacao())) {
                analiseService.deleteDivergence(id, analise);
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @GetMapping(value = "/analises/importar-excel/{id}/{modelo}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @Secured("ROLE_ABACO_ANALISE_EXPORTAR_RELATORIO_EXCEL")
    public ResponseEntity<byte[]> exportarExcel(@PathVariable Long id,@PathVariable Long modelo) throws IOException{
        Analise analise = analiseService.recuperarAnalise(id);
        analise.setFuncaoDados(funcaoDadosRepository.findAllByAnaliseIdOrderByOrdem(id));
        analise.setFuncaoTransacaos(funcaoTransacaoRepository.findAllByAnaliseIdOrderByOrdem(id));
        ByteArrayOutputStream outputStream = planilhaService.selecionarModelo(analise, modelo);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.ms-excel"));
        headers.set(HttpHeaders.CONTENT_DISPOSITION, String.format("attachment; filename=%s.xlsx", RelatorioUtil.pegarNomeRelatorio(analise)));
        return new ResponseEntity<byte[]>(outputStream.toByteArray(),headers, HttpStatus.OK);
    }
}


