package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.domain.Compartilhada;
import br.com.basis.abaco.domain.FuncaoDados;
import br.com.basis.abaco.domain.FuncaoDadosVersionavel;
import br.com.basis.abaco.domain.Grupo;
import br.com.basis.abaco.domain.Sistema;
import br.com.basis.abaco.domain.TipoEquipe;
import br.com.basis.abaco.domain.User;
import br.com.basis.abaco.domain.enumeration.TipoRelatorio;
import br.com.basis.abaco.reports.rest.RelatorioAnaliseRest;
import br.com.basis.abaco.repository.AnaliseRepository;
import br.com.basis.abaco.repository.CompartilhadaRepository;
import br.com.basis.abaco.repository.FuncaoDadosRepository;
import br.com.basis.abaco.repository.FuncaoDadosVersionavelRepository;
import br.com.basis.abaco.repository.FuncaoTransacaoRepository;
import br.com.basis.abaco.repository.GrupoRepository;
import br.com.basis.abaco.repository.UserRepository;
import br.com.basis.abaco.repository.search.AnaliseSearchRepository;
import br.com.basis.abaco.security.SecurityUtils;
import br.com.basis.abaco.service.dto.GrupoDTO;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.transaction.annotation.Transactional;
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
import javax.validation.constraints.NotNull;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.net.URI;
import java.net.URISyntaxException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static org.elasticsearch.index.query.QueryBuilders.multiMatchQuery;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * REST controller for managing Analise.
 */
@RestController
@RequestMapping("/api")
public class AnaliseResource {

    private final Logger log = LoggerFactory.getLogger(AnaliseResource.class);

    private static final String ENTITY_NAME = "analise";

    private static final String ROLE_ANALISTA = "ROLE_ANALISTA";

    private static final String ROLE_ADMIN = "ROLE_ADMIN";

    private static final String ROLE_USER = "ROLE_USER";

    private static final String ROLE_GESTOR = "ROLE_GESTOR";

    private static final String PAGE = "page";

    private final AnaliseRepository analiseRepository;

    private final UserRepository userRepository;

    private final GrupoRepository grupoRepository;

    private final CompartilhadaRepository compartilhadaRepository;

    private final AnaliseSearchRepository analiseSearchRepository;

    private final FuncaoDadosVersionavelRepository funcaoDadosVersionavelRepository;

    private final FuncaoDadosRepository funcaoDadosRepository;

    private final FuncaoTransacaoRepository funcaoTransacaoRepository;

    private RelatorioAnaliseRest relatorioAnaliseRest;

    private DynamicExportsService dynamicExportsService;

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private HttpServletResponse response;

    /**
     * Método construtor.
     *
     * @param analiseRepository
     * @param analiseSearchRepository
     * @param funcaoDadosVersionavelRepository
     */
    public AnaliseResource(AnaliseRepository analiseRepository,
                           AnaliseSearchRepository analiseSearchRepository,
                           FuncaoDadosVersionavelRepository funcaoDadosVersionavelRepository,
                           DynamicExportsService dynamicExportsService,
                           UserRepository userRepository,
                           FuncaoDadosRepository funcaoDadosRepository,
                           CompartilhadaRepository compartilhadaRepository,
                           GrupoRepository grupoRepository,
                           FuncaoTransacaoRepository funcaoTransacaoRepository) {
        this.analiseRepository = analiseRepository;
        this.analiseSearchRepository = analiseSearchRepository;
        this.funcaoDadosVersionavelRepository = funcaoDadosVersionavelRepository;
        this.dynamicExportsService = dynamicExportsService;
        this.userRepository = userRepository;
        this.compartilhadaRepository = compartilhadaRepository;
        this.grupoRepository = grupoRepository;
        this.funcaoDadosRepository = funcaoDadosRepository;
        this.funcaoTransacaoRepository = funcaoTransacaoRepository;
    }

    /**
     * POST /analises : CRIAR UMA ANÁLISE
     *
     * @param analise the analise to create
     * @return the ResponseEntity with status 201 (Created) and with body the new
     * analise, or with status 400 (Bad Request) if the analise has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/analises")
    @Timed
    @Secured({ROLE_ADMIN, ROLE_USER, ROLE_GESTOR, ROLE_ANALISTA})
    public ResponseEntity<Analise> createAnalise(@Valid @RequestBody Analise analise) throws URISyntaxException {
        log.debug("REST request to save Analise : {}", analise);
        if (analise.getId() != null) {
            return ResponseEntity.badRequest().headers(
                HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new analise cannot already have an ID")).body(null);
        }
        analise.setCreatedBy(userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get());
        Analise analiseData = this.salvaNovaData(analise);
        linkFuncoesToAnalise(analiseData);
        Analise result = analiseRepository.save(analiseData);
        unlinkAnaliseFromFuncoes(result);
        analiseSearchRepository.save(analiseData);
        return ResponseEntity.created(new URI("/api/analises/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString())).body(result);
    }


    /**
     * PUT /analises : ATUALIZAR ANÁLISE
     *
     * @param analise the analise to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated
     * analise, or with status 400 (Bad Request) if the analise is not
     * valid, or with status 500 (Internal Server Error) if the analise
     * couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/analises")
    @Timed
    @Secured({ROLE_ADMIN, ROLE_USER, ROLE_GESTOR, ROLE_ANALISTA})
    public ResponseEntity<Analise> updateAnalise(@Valid @RequestBody Analise analise) throws URISyntaxException {
        log.debug("REST request to update Analise : {}", analise);
        if (analise.getId() == null) {
            return createAnalise(analise);
        }
        if (analise.getbloqueiaAnalise()) {
            return ResponseEntity.badRequest().headers(
                HeaderUtil.createFailureAlert(ENTITY_NAME, "analiseblocked", "You cannot edit an blocked analise")).body(null);
        }
        analise.setCreatedOn(analiseRepository.findOneById(analise.getId()).get().getCreatedOn());
        Analise analiseData = this.salvaNovaData(analise);
        linkFuncoesToAnalise(analiseData);
        Analise result = analiseRepository.save(analiseData);
        analiseSearchRepository.save(result);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, analiseData.getId().toString()))
            .body(result);
    }

    private Analise salvaNovaData(Analise analise) {
        if (analise.getDataHomologacao() != null) {
            Timestamp dataDeHoje = new Timestamp(System.currentTimeMillis());
            Timestamp dataParam = analise.getDataHomologacao();
            dataParam.setHours(dataDeHoje.getHours());
            dataParam.setMinutes(dataDeHoje.getMinutes());
            dataParam.setSeconds(dataDeHoje.getSeconds());
        }
        return analise;
    }


    /**
     * PUT /analises : BLOQUEAR ANÁLISE
     */
    @PutMapping("/analises/{id}/block")
    @Timed
    @Secured({ROLE_ADMIN, ROLE_USER, ROLE_GESTOR, ROLE_ANALISTA})
    public ResponseEntity<Analise> blockUnblockAnalise(@PathVariable Long id) throws URISyntaxException {
        log.debug("REST request to block Analise : {}", id);

        Analise analise = recuperarAnalise(id);

        if (analise != null) {
            linkFuncoesToAnalise(analise);
            if (analise.getbloqueiaAnalise()) {
                analise.setbloqueiaAnalise(false);
            } else {
                analise.setbloqueiaAnalise(true);
            }

            Analise result = analiseRepository.save(analise);
            unlinkAnaliseFromFuncoes(result);
            analiseSearchRepository.save(result);
            return ResponseEntity.ok().headers(HeaderUtil.blockEntityUpdateAlert(ENTITY_NAME, analise.getId().toString()))
                .body(result);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new Analise());
        }


    }

    /**
     * POST /analises : BLOQUEAR ANÁLISE
     */
    @PostMapping("/analises/clonar/{id}")
    @Timed
    @Secured({ROLE_ADMIN, ROLE_USER, ROLE_GESTOR, ROLE_ANALISTA})
    public ResponseEntity<Analise> cloneAnalise(@PathVariable Long id) {
        log.debug("REST request to block Analise : {}", id);

        Analise analise = recuperarAnalise(id);

        if (analise != null) {
            Analise analiseCopia = new Analise(analise.getIdentificadorAnalise(),
                analise.getPfTotal(), analise.getAdjustPFTotal(), analise.getSistema(),
                analise.getOrganizacao(),analise.getBaselineImediatamente(), analise.getEquipeResponsavel(), analise.getManual());

            Analise analiseCopiaSalva = analiseRepository.save(analiseCopia);
            analiseSearchRepository.save(analiseCopiaSalva);

            Analise analiseRetorno = unlinkAnaliseFDFT(analise);
            return ResponseEntity.ok().headers(HeaderUtil.blockEntityUpdateAlert(ENTITY_NAME, analiseRetorno.getId().toString()))
                .body(analiseRetorno);
        } else {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(new Analise());
        }


    }

    /**
     * GET /analises/:id : BUSCAR ANÁLISE POR ID CASO O USUÁRIO POSSUA PERMISSÃO
     *
     * @param id the id of the analise to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the analise, or
     * with status 404 (Not Found)
     */
    @GetMapping("/analises/{id}")
    @Timed
    public ResponseEntity<Analise> getAnalise(@PathVariable Long id) {
        log.debug("REST request to get Analise : {}", id);
        Analise analise = recuperarAnalise(id);

        if (analise != null) {
            return ResponseUtil.wrapOrNotFound(Optional.ofNullable(analise));
        } else {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(new Analise());
        }

    }

    /**
     * GET BUSCAR ANÁLISES DA BASELINE
     *
     * @param
     * @return
     */
    @GetMapping("/analises/baseline")
    @Timed
    public List<Analise> getAllAnalisesBaseline() {
        return analiseRepository.findAllByBaseline();
    }

    /**
     * DELETE /analises/:id : DELETAR ANÁLISE CASO O USUÁRIO POSSUA PERMISSÃO
     *
     * @param id the id of the analise to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/analises/{id}")
    @Timed
    @Secured({ROLE_ADMIN, ROLE_USER, ROLE_GESTOR, ROLE_ANALISTA})
    public ResponseEntity<Void> deleteAnalise(@PathVariable Long id) {
        log.debug("REST request to delete Analise : {}", id);

        Analise analise = recuperarAnalise(id);

        if (analise != null) {
            analiseRepository.delete(id);
            analiseSearchRepository.delete(id);
        } else {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(null);
        }


        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * RETORNA UMA LISTA COM TODAS AS EQUIPES QUE TENHAM ACESSOS DAQUELA ANÁLISE
     *
     * @param idAnalise
     * @return
     */
    @GetMapping("/compartilhada/{idAnalise}")
    @Timed
    @Secured({ROLE_ADMIN, ROLE_USER, ROLE_GESTOR, ROLE_ANALISTA})
    public List<Compartilhada> getAllCompartilhadaByAnalise(@PathVariable Long idAnalise) {
        log.debug("REST request to get all Compartilhadas by Análise");
        return compartilhadaRepository.findAllByAnaliseId(idAnalise);
    }

    /**
     * SALVA UMA LISTA CONTENDO TODAS AS EQUIPES DA ANÁLISE
     *
     * @return
     */
    @PostMapping("/analises/compartilhar")
    @Timed
    @Secured({ROLE_ADMIN, ROLE_USER, ROLE_GESTOR, ROLE_ANALISTA})
    public ResponseEntity<List<Compartilhada>> popularCompartilhar(@Valid @RequestBody List<Compartilhada> compartilhadaList) throws URISyntaxException {
        log.debug("REST request to save a list of shared análises : {}", compartilhadaList);
        List<Compartilhada> result = compartilhadaRepository.save(compartilhadaList);
        return ResponseEntity.created(new URI("/api/analises/compartilhar"))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, "created")).body(result);
    }

    /**
     * DELETA UMA OU MAIS ANÁLISES COMPARTILHADAS
     *
     * @return
     */
    @DeleteMapping("/analises/compartilhar/delete/{id}")
    @Timed
    @Secured({ROLE_ADMIN, ROLE_USER, ROLE_GESTOR, ROLE_ANALISTA})
    public ResponseEntity<Void> deleteCompartilharAnalise(@PathVariable Long id) {
        log.debug("REST request to remove a shared análise : {}", id);
        compartilhadaRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * Atualiza um compartilhamento para "Somente visualizar ou Editar"
     */
    @PutMapping("/analises/compartilhar/viewonly/{id}")
    @Timed
    @Secured({ROLE_ADMIN, ROLE_USER, ROLE_GESTOR, ROLE_ANALISTA})
    public ResponseEntity<Compartilhada> viewOnly(@Valid @RequestBody Compartilhada compartilhada) throws URISyntaxException {
        log.debug("REST request to update viewOnly in Compartilhada : {}", compartilhada);
        Compartilhada result = compartilhadaRepository.save(compartilhada);
        return ResponseEntity.ok().headers(HeaderUtil.blockEntityUpdateAlert(ENTITY_NAME, compartilhada.getId().toString()))
            .body(result);
    }


    /**
     * Método responsável por requisitar a geração do relatório de Análise.
     *
     * @param id
     * @throws URISyntaxException
     * @throws JRException
     * @throws IOException
     */
    @GetMapping("/relatorioPdfArquivo/{id}")
    @Timed
    public ResponseEntity<byte[]> downloadPdfArquivo(@PathVariable Long id) throws URISyntaxException, IOException, JRException {
        Analise analise = recuperarAnalise(id);
        relatorioAnaliseRest = new RelatorioAnaliseRest(this.response, this.request);
        log.debug("REST request to generate report Analise at download archive: {}", analise);
        return relatorioAnaliseRest.downloadPdfArquivo(analise, TipoRelatorio.ANALISE);
    }

    /**
     * Método responsável por requisitar a geração do relatório de Análise.
     *
     * @throws URISyntaxException
     * @throws JRException
     * @throws IOException
     */
    @GetMapping("/relatorioPdfBrowser/{id}")
    @Timed
    public @ResponseBody
    byte[] downloadPdfBrowser(@PathVariable Long id) throws URISyntaxException, IOException, JRException {
        Analise analise = recuperarAnalise(id);
        relatorioAnaliseRest = new RelatorioAnaliseRest(this.response, this.request);
        log.debug("REST request to generate report Analise in browser : {}", analise);
        return relatorioAnaliseRest.downloadPdfBrowser(analise, TipoRelatorio.ANALISE);
    }

    /**
     * Método responsável por requisitar a geração do relatório de Análise.
     *
     * @throws URISyntaxException
     * @throws JRException
     * @throws IOException
     */
    @GetMapping("/downloadPdfDetalhadoBrowser/{id}")
    @Timed
    public @ResponseBody
    byte[] downloadPdfDetalhadoBrowser(@PathVariable Long id) throws URISyntaxException, IOException, JRException {
        Analise analise = recuperarAnalise(id);
        relatorioAnaliseRest = new RelatorioAnaliseRest(this.response, this.request);
        log.debug("REST request to generate report Analise detalhado in browser : {}", analise);
        return relatorioAnaliseRest.downloadPdfBrowser(analise, TipoRelatorio.ANALISE_DETALHADA);
    }

    /**
     * Método responsável por requisitar a geração do relatório de Análise.
     *
     * @throws URISyntaxException
     * @throws JRException
     * @throws IOException
     */
    @GetMapping("/downloadRelatorioExcel/{id}")
    @Timed
    public @ResponseBody
    byte[] downloadRelatorioExcel(@PathVariable Long id) throws URISyntaxException, IOException, JRException {
        Analise analise = recuperarAnalise(id);
        relatorioAnaliseRest = new RelatorioAnaliseRest(this.response, this.request);
        log.debug("REST request to generate a report in XLS : {}", analise);
        return relatorioAnaliseRest.downloadExcel(analise);
    }

    /**
     *
     * @param id
     * @return
     */
    @GetMapping("/relatorioContagemPdf/{id}")
    @Timed
    public @ResponseBody
    ResponseEntity<InputStreamResource> gerarRelatorioContagemPdf(@PathVariable Long id) throws IOException, JRException {
        Analise analise = recuperarAnaliseContagem(id);
        relatorioAnaliseRest = new RelatorioAnaliseRest(this.response, this.request);
        log.debug("REST request to generate a count report : {}", analise);
        return relatorioAnaliseRest.downloadReportContagem(analise);
    }


    /**
     * Método responsável pela exportação da pesquisa.
     *
     * @param tipoRelatorio
     * @throws RelatorioException
     */
    @GetMapping(value = "/analise/exportacao/{tipoRelatorio}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @Timed
    public ResponseEntity<InputStreamResource> gerarRelatorioExportacao(@PathVariable String tipoRelatorio, @RequestParam(defaultValue = "*") String query) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream;
        try {
            new NativeSearchQueryBuilder().withQuery(multiMatchQuery(query)).build();
            Page<Analise> result = analiseSearchRepository.search(queryStringQuery(query), dynamicExportsService.obterPageableMaximoExportacao());
            byteArrayOutputStream = dynamicExportsService.export(new RelatorioAnaliseColunas(), result, tipoRelatorio, Optional.empty(), Optional.ofNullable(AbacoUtil.REPORT_LOGO_PATH), Optional.ofNullable(AbacoUtil.getReportFooter()));
        } catch (DRException | ClassNotFoundException | JRException | NoClassDefFoundError e) {
            log.error(e.getMessage(), e);
            throw new RelatorioException(e);
        }
        return DynamicExporter.output(byteArrayOutputStream,
            "relatorio." + tipoRelatorio);
    }

    /**
     * GET /analisesEquipes : LISTAR TODAS AS ANALISES POR EQUIPE
     *
     * @return the ResponseEntity with status 200 (OK) and the list of analises in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @GetMapping("/analises")
    @Timed
    public ResponseEntity<List<GrupoDTO>> getAllAnalisesEquipes(
        @RequestParam(defaultValue = "asc") String order,
        @RequestParam(defaultValue = "0", name = PAGE) int pageNumber,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(defaultValue = "id") String sort,
        @RequestParam(value = "identificador") Optional<String> identificador,
        @RequestParam(value = "sistema") Optional<String> sistema,
        @RequestParam(value = "metodo") Optional<String> metodo,
        @RequestParam(value = "organizacao") Optional<String> organizacao,
        @RequestParam(value = "equipe") Optional<String> equipe,
        @RequestParam(value = "usuario") Optional<String> usuario)

        throws URISyntaxException {
        Sort.Direction sortOrder = PageUtils.getSortDirection(order);
        Pageable pageable = new PageRequest(pageNumber, size, sortOrder, sort);

        List<TipoEquipe> listaEquipes = userRepository.findAllEquipesByLogin(SecurityUtils.getCurrentUserLogin());

        List<Long> equipesIds = new ArrayList<>();

        for (TipoEquipe equipes : listaEquipes) {
            equipesIds.add(equipes.getId());
        }
        
        return verificaEquipe(identificador, sistema, metodo, organizacao, equipe, pageable, equipesIds, usuario);


    }

    private ResponseEntity<List<GrupoDTO>> verificaEquipe(Optional<String> identificador, Optional<String> sistema,
                                                          Optional<String> metodo, Optional<String> organizacao, Optional<String> equipe, Pageable pageable,
                                                          List<Long> equipesIds, Optional<String> usuario) throws URISyntaxException {
      
      List<BigInteger> idsAnalises;
      if (equipesIds.size() != 0) {
          idsAnalises = analiseRepository.listAnalisesEquipe(equipesIds);
          if (idsAnalises.size() != 0) {
              Page<Grupo> page = grupoRepository.findByIdAnalises(this.converteListaBigIntLong(idsAnalises),
                  identificador.orElse(null), sistema.orElse(null), metodo.orElse(null),
                  organizacao.orElse(null), equipe.orElse(null), usuario.orElse(null), pageable);
              page.forEach(grupo -> {
                  Set<User> users = userRepository.findAllByAnalise(grupo.getIdAnalise());
                  grupo.setUsuarios(users);
              });
              Page<GrupoDTO> pageDTO = page.map(GrupoDTO::new);
              HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(pageDTO, "/api/analises/equipes");
              return new ResponseEntity<>(pageDTO.getContent(), headers, HttpStatus.OK);
          }
      }


      return new ResponseEntity<>(new ArrayList<GrupoDTO>(), null, HttpStatus.OK);
    }


    /**
     * Função para converter lista de BigInteger em lista de Long sem alterar a lista original
     *
     * @param listaBig a lista de BigInterger a ser convertida
     * @return Retorna uma lista de Long
     */
    private List<Long> converteListaBigIntLong(List<BigInteger> listaBig) {
        List<Long> listaLong = new ArrayList<>();

        for (BigInteger elementoBig : listaBig) {
            listaLong.add(elementoBig.longValue());
        }
        return listaLong;
    }


    private Boolean checarPermissao(Long idAnalise) {
        // Busca o usuário
        Optional<User> logged = userRepository.findOneWithAuthoritiesByLogin(SecurityUtils.getCurrentUserLogin());
        // Traz as equipes do usuário
        List<BigInteger> equipesIds = userRepository.findUserEquipes(logged.get().getId());
        // Traz as
        List<Long> convertidos = equipesIds.stream().map(bigInteger -> bigInteger.longValue()).collect(Collectors.toList());
        Integer analiseDaEquipe = analiseRepository.analiseEquipe(idAnalise, convertidos);

        // Verifica se a analise faz parte de sua equipe
        if (analiseDaEquipe.intValue() == 0) {
            return verificaCompartilhada(idAnalise);
        } else {
            return true;
        }

    }

    private Boolean verificaCompartilhada(Long idAnalise) {
        if (analiseRepository.analiseCompartilhada(idAnalise) == null) {
            return false;
        }
        return analiseRepository.analiseCompartilhada(idAnalise);

    }

    private Analise recuperarAnalise(Long id) {

        boolean retorno = checarPermissao(id);

        if (retorno) {
            return analiseRepository.findOne(id);
        } else {
            return null;
        }
    }

    @Transactional(readOnly = true)
    private Analise recuperarAnaliseContagem(@NotNull Long id) {

        boolean retorno = checarPermissao(id);

        if (retorno) {
            Analise analise = analiseRepository.reportContagem(id);
            Sistema sistema = analise.getSistema();
            if(sistema != null) {
            sistema.getModulos().forEach(modulo -> {
                    modulo.getFuncionalidades().forEach(funcionalidade -> {
                        funcionalidade.setFuncoesDados(funcaoDadosRepository.findByAnaliseFuncionalidade(id, funcionalidade.getId()));
                        funcionalidade.setFuncoesTransacao(funcaoTransacaoRepository.findByAnaliseFuncionalidade(id, funcionalidade.getId()));
                    });
                });
                return analise;
            }
            return null;
        } else {
            return null;
        }
    }

    private void linkFuncoesToAnalise(Analise analise) {
        linkAnaliseToFuncaoDados(analise);
        linkAnaliseToFuncaoTransacaos(analise);
    }

    private void linkAnaliseToFuncaoDados(Analise analise) {
        Optional.ofNullable(analise.getFuncaoDados()).orElse(Collections.emptySet())
            .forEach(funcaoDados -> {
                funcaoDados.setAnalise(analise);
                linkFuncaoDadosRelationships(funcaoDados);
                handleVersionFuncaoDados(funcaoDados, analise.getSistema());
            });
    }

    private void linkFuncaoDadosRelationships(FuncaoDados funcaoDados) {
        Optional.ofNullable(funcaoDados.getFiles()).orElse(Collections.emptyList())
            .forEach(file -> file.setFuncaoDados(funcaoDados));
        Optional.ofNullable(funcaoDados.getDers()).orElse(Collections.emptySet())
            .forEach(der -> der.setFuncaoDados(funcaoDados));
        Optional.ofNullable(funcaoDados.getRlrs()).orElse(Collections.emptySet())
            .forEach(rlr -> rlr.setFuncaoDados(funcaoDados));
    }

    private void handleVersionFuncaoDados(FuncaoDados funcaoDados, Sistema sistema) {
        String nome = funcaoDados.getName();
        Optional<FuncaoDadosVersionavel> funcaoDadosVersionavel =
            funcaoDadosVersionavelRepository.findOneByNomeIgnoreCaseAndSistemaId(nome, sistema.getId());
        if (funcaoDadosVersionavel.isPresent()) {
            funcaoDados.setFuncaoDadosVersionavel(funcaoDadosVersionavel.get());
        } else {
            FuncaoDadosVersionavel novaFDVersionavel = new FuncaoDadosVersionavel();
            novaFDVersionavel.setNome(funcaoDados.getName());
            novaFDVersionavel.setSistema(sistema);
            FuncaoDadosVersionavel result = funcaoDadosVersionavelRepository.save(novaFDVersionavel);
            funcaoDados.setFuncaoDadosVersionavel(result);
        }
    }

    private void linkAnaliseToFuncaoTransacaos(Analise analise) {
        Optional.ofNullable(analise.getFuncaoTransacaos()).orElse(Collections.emptySet())
            .forEach(funcaoTransacao -> {
                funcaoTransacao.setAnalise(analise);
                Optional.ofNullable(funcaoTransacao.getFiles()).orElse(Collections.emptyList())
                    .forEach(file -> file.setFuncaoTransacao(funcaoTransacao));
                Optional.ofNullable(funcaoTransacao.getDers()).orElse(Collections.emptySet())
                    .forEach(der -> der.setFuncaoTransacao(funcaoTransacao));
                Optional.ofNullable(funcaoTransacao.getAlrs()).orElse(Collections.emptySet())
                    .forEach(alr -> alr.setFuncaoTransacao(funcaoTransacao));
            });
    }

    private void unlinkAnaliseFromFuncoes(Analise result) {
        Optional.ofNullable(result.getFuncaoDados()).orElse(Collections.emptySet())
            .forEach(entry -> {
                entry.setAnalise(null);
            });
        Optional.ofNullable(result.getFuncaoTransacaos()).orElse(Collections.emptySet())
            .forEach(entry -> {
                entry.setAnalise(null);
            });
    }


    private Analise unlinkAnaliseFDFT(Analise result) {

        getFuncaoDados(result);

        Optional.ofNullable(result.getFuncaoTransacaos()).orElse(Collections.emptySet())
            .forEach(ft -> {
                ft.setAnalise(null);
                Optional.ofNullable(ft.getAlrs()).orElse(Collections.emptySet())
                    .forEach(rlr -> rlr.setId(null));
                Optional.ofNullable(ft.getDers()).orElse(Collections.emptySet())
                    .forEach(ders -> ders.setId(null));
            });

        Analise analiseCopiaSalva = analiseRepository.save(result);
        analiseSearchRepository.save(result);

        return analiseCopiaSalva;
    }

    private Analise getFuncaoDados(Analise result) {
        return result;
    }


}


