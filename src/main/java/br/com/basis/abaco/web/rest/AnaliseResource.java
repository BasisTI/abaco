package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.domain.Compartilhada;
import br.com.basis.abaco.domain.TipoEquipe;
import br.com.basis.abaco.domain.UploadedFile;
import br.com.basis.abaco.domain.User;
import br.com.basis.abaco.domain.enumeration.MetodoContagem;
import br.com.basis.abaco.domain.enumeration.TipoRelatorio;
import br.com.basis.abaco.reports.rest.RelatorioAnaliseRest;
import br.com.basis.abaco.repository.AnaliseRepository;
import br.com.basis.abaco.repository.CompartilhadaRepository;
import br.com.basis.abaco.repository.FuncaoDadosRepository;
import br.com.basis.abaco.repository.FuncaoTransacaoRepository;
import br.com.basis.abaco.repository.TipoEquipeRepository;
import br.com.basis.abaco.repository.UploadedFilesRepository;
import br.com.basis.abaco.repository.UserRepository;
import br.com.basis.abaco.repository.search.AnaliseSearchRepository;
import br.com.basis.abaco.repository.search.UserSearchRepository;
import br.com.basis.abaco.security.AuthoritiesConstants;
import br.com.basis.abaco.security.SecurityUtils;
import br.com.basis.abaco.service.AnaliseService;
import br.com.basis.abaco.service.dto.AnaliseDTO;
import br.com.basis.abaco.service.dto.AnaliseEditDTO;
import br.com.basis.abaco.service.exception.RelatorioException;
import br.com.basis.abaco.service.relatorio.RelatorioAnaliseColunas;
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
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.Set;


@RestController
@RequestMapping("/api")
public class AnaliseResource {

    private final Logger log = LoggerFactory.getLogger(AnaliseResource.class);
    private static final String ENTITY_NAME = "analise";
    private static final String PAGE = "page";
    private final AnaliseRepository analiseRepository;
    private final UserRepository userRepository;
    private final AnaliseService analiseService;
    private final CompartilhadaRepository compartilhadaRepository;
    private final AnaliseSearchRepository analiseSearchRepository;
    private final FuncaoDadosRepository funcaoDadosRepository;
    private final FuncaoTransacaoRepository funcaoTransacaoRepository;
    private final DynamicExportsService dynamicExportsService;
    private final ElasticsearchTemplate elasticsearchTemplate;

    private RelatorioAnaliseRest relatorioAnaliseRest;
    @Autowired
    private TipoEquipeRepository tipoEquipeRepository;
    @Autowired
    private UserSearchRepository userSearchRepository;
    @Autowired
    private HttpServletRequest request;
    @Autowired
    private HttpServletResponse response;
    @Autowired
    private UploadedFilesRepository uploadedFilesRepository;

    public AnaliseResource(AnaliseRepository analiseRepository,
                           AnaliseSearchRepository analiseSearchRepository,
                           DynamicExportsService dynamicExportsService,
                           UserRepository userRepository,
                           FuncaoDadosRepository funcaoDadosRepository,
                           CompartilhadaRepository compartilhadaRepository,
                           FuncaoTransacaoRepository funcaoTransacaoRepository,
                           ElasticsearchTemplate elasticsearchTemplate,
                           AnaliseService analiseService) {
        this.analiseRepository = analiseRepository;
        this.analiseSearchRepository = analiseSearchRepository;
        this.dynamicExportsService = dynamicExportsService;
        this.userRepository = userRepository;
        this.compartilhadaRepository = compartilhadaRepository;
        this.funcaoDadosRepository = funcaoDadosRepository;
        this.funcaoTransacaoRepository = funcaoTransacaoRepository;
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.analiseService = analiseService;
    }

    @PostMapping("/analises")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.GESTOR, AuthoritiesConstants.ANALISTA})
    public ResponseEntity<AnaliseEditDTO> createAnalise(@Valid @RequestBody Analise analise) throws URISyntaxException {
        if (analise.getId() != null) {
            return ResponseEntity.badRequest().headers(
                HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new analise cannot already have an ID")).body(null);
        }
        analise.setCreatedBy(userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get());
        analise.getUsers().add(analise.getCreatedBy());
        analiseService.salvaNovaData(analise);
        analiseRepository.save(analise);
        AnaliseEditDTO analiseEditDTO =  analiseService.convertToAnaliseEditDTO(analise);
        analiseSearchRepository.save(analiseService.convertToEntity(analiseService.convertToDto(analise)));
        return ResponseEntity.created(new URI("/api/analises/" + analise.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, analise.getId().toString())).body(analiseEditDTO);
    }

    @PutMapping("/analises")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.GESTOR, AuthoritiesConstants.ANALISTA})
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
        AnaliseEditDTO analiseEditDTO =  analiseService.convertToAnaliseEditDTO(analise);
        analiseSearchRepository.save(analiseService.convertToEntity(analiseService.convertToDto(analise)));
        return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, analise.getId().toString()))
            .body(analiseEditDTO);
    }

    @PutMapping("/analises/{id}/block")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.GESTOR, AuthoritiesConstants.ANALISTA})
    public ResponseEntity<AnaliseEditDTO> blockUnblockAnalise(@PathVariable Long id, @Valid @RequestBody Analise analiseUpdate) throws URISyntaxException {
        log.debug("REST request to block Analise : {}", id);
        Analise analise = analiseService.recuperarAnalise(id);
        if (analise != null && !(analise.getDataHomologacao() == null && analiseUpdate.getDataHomologacao() == null)) {
            if (analise.getDataHomologacao() == null && analiseUpdate.getDataHomologacao() != null) {
                analise.setDataHomologacao(analiseUpdate.getDataHomologacao());
            }
            analiseService.linkFuncoesToAnalise(analise);
            analise.setBloqueiaAnalise(!analise.isBloqueiaAnalise());
            Analise result = analiseRepository.save(analise);
            analiseSearchRepository.save(analiseService.convertToEntity(analiseService.convertToDto(analise)));
            return ResponseEntity.ok().headers(HeaderUtil.blockEntityUpdateAlert(ENTITY_NAME, analise.getId().toString())).body(analiseService.convertToAnaliseEditDTO(result));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new AnaliseEditDTO());
        }
    }

    @GetMapping("/analises/clonar/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.GESTOR, AuthoritiesConstants.ANALISTA})
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
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.GESTOR, AuthoritiesConstants.ANALISTA})
    public ResponseEntity<AnaliseEditDTO> cloneAnaliseToEquipe(@PathVariable Long id, @PathVariable Long idEquipe) {
        Analise analise = analiseService.recuperarAnalise(id);
        TipoEquipe tipoEquipe = tipoEquipeRepository.findById(idEquipe);
        if (analise.getId() != null && tipoEquipe.getId() != null && !(analise.getClonadaParaEquipe())) {
            analise.setClonadaParaEquipe(true);
            Analise analiseClone = new Analise(analise, userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get());
            analiseService.bindAnaliseCloneForTipoEquipe(analise, tipoEquipe, analiseClone);
            analiseRepository.save(analiseClone);
            analiseSearchRepository.save(analiseService.convertToEntity(analiseService.convertToDto(analiseClone)));
            analiseRepository.save(analise);
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
    public ResponseEntity<AnaliseEditDTO> getAnalise(@PathVariable Long id) {
        Analise analise = analiseService.recuperarAnalise(id);
        if (analise != null) {
            User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();
            if (analiseService.permissionToEdit(user, analise)) {
                AnaliseEditDTO analiseEditDTO = analiseService.convertToAnaliseEditDTO(analise);
                return ResponseUtil.wrapOrNotFound(Optional.ofNullable(analiseEditDTO));
            }
        }
        return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(null);

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
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.GESTOR, AuthoritiesConstants.ANALISTA})
    public ResponseEntity<Void> deleteAnalise(@PathVariable Long id) {

        Analise analise = analiseService.recuperarAnalise(id);
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();
        if (analise != null) {
            if (user.getOrganizacoes().contains(analise.getOrganizacao()) && user.getTipoEquipes().contains(analise.getEquipeResponsavel())) {
                analiseRepository.delete(id);
                analiseSearchRepository.delete(id);
            }
        } else {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(null);
        }


        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @GetMapping("/compartilhada/{idAnalise}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.GESTOR, AuthoritiesConstants.ANALISTA})
    public List<Compartilhada> getAllCompartilhadaByAnalise(@PathVariable Long idAnalise) {
        return compartilhadaRepository.findAllByAnaliseId(idAnalise);
    }

    @PostMapping("/analises/compartilhar")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.GESTOR, AuthoritiesConstants.ANALISTA})
    public ResponseEntity<Set<Compartilhada>> popularCompartilhar(@Valid @RequestBody Set<Compartilhada> compartilhadaList) throws URISyntaxException {
        compartilhadaList.forEach(compartilhada -> {
            compartilhadaRepository.save(compartilhada);
        });
        analiseService.bindAnaliseCompartilhada(compartilhadaList);
        return ResponseEntity.created(new URI("/api/analises/compartilhar"))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, "created")).body(compartilhadaList);
    }

    @DeleteMapping("/analises/compartilhar/delete/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.GESTOR, AuthoritiesConstants.ANALISTA})
    public ResponseEntity<Void> deleteCompartilharAnalise(@PathVariable Long id) {
        Compartilhada compartilhada = compartilhadaRepository.getOne(id);
        Analise analise = analiseRepository.getOne(compartilhada.getAnaliseId());
        analise.getCompartilhadas().remove(compartilhada);
        analiseRepository.save(analise);
        analiseSearchRepository.save(analiseService.convertToEntity(analiseService.convertToDto(analise)));
        compartilhadaRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @PutMapping("/analises/compartilhar/viewonly/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.GESTOR, AuthoritiesConstants.ANALISTA})
    public ResponseEntity<Compartilhada> viewOnly(@Valid @RequestBody Compartilhada compartilhada) throws URISyntaxException {
        Compartilhada result = compartilhadaRepository.save(compartilhada);

        return ResponseEntity.ok().headers(HeaderUtil.blockEntityUpdateAlert(ENTITY_NAME, compartilhada.getId().toString()))
            .body(result);
    }


    @GetMapping("/relatorioPdfArquivo/{id}")
    @Timed
    public ResponseEntity<byte[]> downloadPdfArquivo(@PathVariable Long id) throws URISyntaxException, IOException, JRException {
        Analise analise = analiseService.recuperarAnalise(id);
        relatorioAnaliseRest = new RelatorioAnaliseRest(this.response, this.request);
        return relatorioAnaliseRest.downloadPdfArquivo(analise, TipoRelatorio.ANALISE);
    }

    @GetMapping("/relatorioPdfBrowser/{id}")
    @Timed
    public @ResponseBody
    byte[] downloadPdfBrowser(@PathVariable Long id) throws URISyntaxException, IOException, JRException {
        Analise analise = analiseService.recuperarAnalise(id);
        relatorioAnaliseRest = new RelatorioAnaliseRest(this.response, this.request);
        return relatorioAnaliseRest.downloadPdfBrowser(analise, TipoRelatorio.ANALISE);
    }

    @GetMapping("/downloadPdfDetalhadoBrowser/{id}")
    @Timed
    public @ResponseBody
    byte[] downloadPdfDetalhadoBrowser(@PathVariable Long id) throws URISyntaxException, IOException, JRException {
        Analise analise = analiseService.recuperarAnalise(id);
        analise.setFuncaoDados(funcaoDadosRepository.findByAnaliseIdOrderByFuncionalidadeModuloNomeAscFuncionalidadeNomeAscNameAsc(id));
        analise.setFuncaoTransacaos(funcaoTransacaoRepository.findByAnaliseIdOrderByFuncionalidadeModuloNomeAscFuncionalidadeNomeAscNameAsc(id));
        relatorioAnaliseRest = new RelatorioAnaliseRest(this.response, this.request);
        return relatorioAnaliseRest.downloadPdfBrowser(analise, TipoRelatorio.ANALISE_DETALHADA);
    }

    @GetMapping("/downloadRelatorioExcel/{id}")
    @Timed
    public @ResponseBody
    byte[] downloadRelatorioExcel(@PathVariable Long id) throws URISyntaxException, IOException, JRException {
        Analise analise = analiseService.recuperarAnalise(id);
        relatorioAnaliseRest = new RelatorioAnaliseRest(this.response, this.request);
        Long idLogo = analise.getOrganizacao().getLogoId();
        UploadedFile uploadedFiles = new UploadedFile();
        if(idLogo!= null && idLogo > 0 ) {
            uploadedFiles = uploadedFilesRepository.findOne(idLogo);
        }
        return relatorioAnaliseRest.downloadExcel(analise, uploadedFiles);
    }

    @GetMapping("/relatorioContagemPdf/{id}")
    @Timed
    public @ResponseBody
    ResponseEntity<InputStreamResource> gerarRelatorioContagemPdf(@PathVariable Long id) throws IOException, JRException {
        Analise analise = analiseService.recuperarAnaliseContagem(id);
        relatorioAnaliseRest = new RelatorioAnaliseRest(this.response, this.request);
        return relatorioAnaliseRest.downloadReportContagem(analise);
    }

    @GetMapping(value = "/analise/exportacao/{tipoRelatorio}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @Timed
    public ResponseEntity<InputStreamResource> gerarRelatorioExportacao(@PathVariable String tipoRelatorio,
                                                                        @RequestParam(defaultValue = "ASC", required = false) String order,
                                                                        @RequestParam(defaultValue = "0", name = PAGE) int pageNumber,
                                                                        @RequestParam(defaultValue = "20") int size,
                                                                        @RequestParam(defaultValue = "id") String sort,
                                                                        @RequestParam(value = "identificador", required = false) String identificador,
                                                                        @RequestParam(value = "sistema", required = false) Set<Long> sistema,
                                                                        @RequestParam(value = "metodo", required = false) Set<MetodoContagem> metodo,
                                                                        @RequestParam(value = "organizacao", required = false) Set<Long> organizacao,
                                                                        @RequestParam(value = "equipeResponsavel", required = false) Long equipe,
                                                                        @RequestParam(value = "users", required = false) Set<Long> usuario) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream;
        try {
            Pageable pageable = dynamicExportsService.obterPageableMaximoExportacao();
            BoolQueryBuilder qb = analiseService.getBoolQueryBuilder(identificador, sistema, metodo, organizacao, equipe, usuario);
            SearchQuery searchQuery = new NativeSearchQueryBuilder().withQuery(qb).withPageable(pageable).build();
            Page<Analise> page = elasticsearchTemplate.queryForPage(searchQuery, Analise.class);
            byteArrayOutputStream = dynamicExportsService.export(new RelatorioAnaliseColunas(), page, tipoRelatorio, Optional.empty(), Optional.ofNullable(AbacoUtil.REPORT_LOGO_PATH), Optional.ofNullable(AbacoUtil.getReportFooter()));
        } catch (DRException | ClassNotFoundException | JRException | NoClassDefFoundError e) {
            log.error(e.getMessage(), e);
            throw new RelatorioException(e);
        }
        return DynamicExporter.output(byteArrayOutputStream,
            "relatorio." + tipoRelatorio);
    }

    @GetMapping("/analises")
    @Timed
    public ResponseEntity<List<AnaliseDTO>> getAllAnalisesEquipes(@RequestParam(defaultValue = "ASC", required = false) String order,
                                                                  @RequestParam(defaultValue = "0", name = PAGE) int pageNumber,
                                                                  @RequestParam(defaultValue = "20") int size,
                                                                  @RequestParam(defaultValue = "id") String sort,
                                                                  @RequestParam(value = "identificadorAnalise", required = false) String identificador,
                                                                  @RequestParam(value = "sistema", required = false) Set<Long> sistema,
                                                                  @RequestParam(value = "metodoContagem", required = false) Set<MetodoContagem> metodo,
                                                                  @RequestParam(value = "organizacao", required = false) Set<Long> organizacao,
                                                                  @RequestParam(value = "equipe", required = false) Long equipe,
                                                                  @RequestParam(value = "usuario", required = false) Set<Long> usuario)
        throws URISyntaxException {
        Sort.Direction sortOrder = PageUtils.getSortDirection(order);
        Pageable pageable = new PageRequest(pageNumber, size, sortOrder, sort);
        FieldSortBuilder sortBuilder = new FieldSortBuilder(sort).order(SortOrder.ASC);
        BoolQueryBuilder qb = analiseService.getBoolQueryBuilder(identificador, sistema, metodo, organizacao, equipe, usuario);
        SearchQuery searchQuery = new NativeSearchQueryBuilder().withQuery(qb).withPageable(pageable).withSort(sortBuilder).build();
        Page<Analise> page = elasticsearchTemplate.queryForPage(searchQuery, Analise.class);
        Page<AnaliseDTO> dtoPage = page.map(analise -> analiseService.convertToDto(analise));
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/analises/");
        return new ResponseEntity<>(dtoPage.getContent(), headers, HttpStatus.OK);
    }

    @GetMapping("/analises/update-pf/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.GESTOR, AuthoritiesConstants.ANALISTA})
    public ResponseEntity<AnaliseEditDTO> updateSomaPf(@PathVariable Long id) {
        Analise analise = analiseService.recuperarAnalise(id);
        if (analise.getId() != null) {
            analiseService.updatePf(analise);
            analiseRepository.save(analise);
            analiseSearchRepository.save(analiseService.convertToEntity(analiseService.convertToDto(analise)));
            return ResponseEntity.ok().headers(HeaderUtil.blockEntityUpdateAlert(ENTITY_NAME, analise.getId().toString()))
                .body(analiseService.convertToAnaliseEditDTO(analise));
        } else {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(new AnaliseEditDTO());
        }
    }
}


