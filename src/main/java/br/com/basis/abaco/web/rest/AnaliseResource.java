package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.*;
import br.com.basis.abaco.domain.enumeration.TipoRelatorio;
import br.com.basis.abaco.reports.rest.RelatorioAnaliseRest;
import br.com.basis.abaco.repository.*;
import br.com.basis.abaco.repository.search.AnaliseSearchRepository;
import br.com.basis.abaco.repository.search.UserSearchRepository;
import br.com.basis.abaco.security.SecurityUtils;
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
import io.swagger.annotations.ApiParam;
import net.sf.dynamicreports.report.exception.DRException;
import net.sf.jasperreports.engine.JRException;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
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
import java.math.BigInteger;
import java.net.URI;
import java.net.URISyntaxException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.multiMatchQuery;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * REST controller for managing Analise.
 */
@RestController
@RequestMapping("/api")
public class AnaliseResource {

    private static final String QUERY_MSG_CONST = "REST request to search for a page of Analises for query {}";

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

    private final UserSearchRepository userSearchRepository;

    private final FuncaoDadosVersionavelRepository funcaoDadosVersionavelRepository;

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
                           UserSearchRepository userSearchRepository,
                           CompartilhadaRepository compartilhadaRepository,
                           GrupoRepository grupoRepository) {
        this.analiseRepository = analiseRepository;
        this.analiseSearchRepository = analiseSearchRepository;
        this.funcaoDadosVersionavelRepository = funcaoDadosVersionavelRepository;
        this.dynamicExportsService = dynamicExportsService;
        this.userRepository = userRepository;
        this.userSearchRepository = userSearchRepository;
        this.compartilhadaRepository = compartilhadaRepository;
        this.grupoRepository = grupoRepository;
    }

    /**
     * POST /analises : Create a new analise.
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
     * @param id
     * @return
     */
    private Analise recuperarAnalise(Long id) {
        return analiseRepository.findOne(id);
    }

    /**
     * @param analise
     */
    private void linkFuncoesToAnalise(Analise analise) {
        linkAnaliseToFuncaoDados(analise);
        linkAnaliseToFuncaoTransacaos(analise);
    }

    /**
     * @param analise
     */
    private void linkAnaliseToFuncaoDados(Analise analise) {
        analise.getFuncaoDados().forEach(funcaoDados -> {
            funcaoDados.setAnalise(analise);
            linkFuncaoDadosRelationships(funcaoDados);
            handleVersionFuncaoDados(funcaoDados, analise.getSistema());
        });
    }

    /**
     * @param funcaoDados
     */
    private void linkFuncaoDadosRelationships(FuncaoDados funcaoDados) {
        funcaoDados.getFiles().forEach(file -> file.setFuncaoDados(funcaoDados));
        funcaoDados.getDers().forEach(der -> der.setFuncaoDados(funcaoDados));
        funcaoDados.getRlrs().forEach(rlr -> rlr.setFuncaoDados(funcaoDados));
    }

    /**
     * @param funcaoDados
     * @param sistema
     */
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

    /**
     * @param analise
     */
    private void linkAnaliseToFuncaoTransacaos(Analise analise) {
        analise.getFuncaoTransacaos().forEach(funcaoTransacao -> {
            funcaoTransacao.setAnalise(analise);
            funcaoTransacao.getFiles().forEach(file -> file.setFuncaoTransacao(funcaoTransacao));
            funcaoTransacao.getDers().forEach(der -> der.setFuncaoTransacao(funcaoTransacao));
            funcaoTransacao.getAlrs().forEach(alr -> alr.setFuncaoTransacao(funcaoTransacao));
        });
    }

    /**
     * @param result
     */
    private void unlinkAnaliseFromFuncoes(Analise result) {
        result.getFuncaoDados().forEach(entry -> {
            entry.setAnalise(null);
        });
        result.getFuncaoTransacaos().forEach(entry -> {
            entry.setAnalise(null);
        });
    }

    /**
     * PUT /analises : Updates an existing analise.
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
        unlinkAnaliseFromFuncoes(result);
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

    @PutMapping("/analises/{id}/block")
    @Timed
    @Secured({ROLE_ADMIN, ROLE_USER, ROLE_GESTOR, ROLE_ANALISTA})
    public ResponseEntity<Analise> blockAnalise(@Valid @RequestBody Analise analise) throws URISyntaxException {
        log.debug("REST request to block Analise : {}", analise);
        Optional<User> logged = userRepository.findOneWithAuthoritiesByLogin(SecurityUtils.getCurrentUserLogin());
        if (logged.isPresent() && !logged.get().verificarAuthority()) {
            return ResponseEntity.badRequest().headers(
                HeaderUtil.createFailureAlert(ENTITY_NAME, "notadmin", "Only admin users can block/unblock análises")).body(null);
        }
        linkFuncoesToAnalise(analise);
        analise.setbloqueiaAnalise(true);
        Analise result = analiseRepository.save(analise);
        unlinkAnaliseFromFuncoes(result);
        analiseSearchRepository.save(result);
        return ResponseEntity.ok().headers(HeaderUtil.blockEntityUpdateAlert(ENTITY_NAME, analise.getId().toString()))
            .body(result);
    }

    @PutMapping("/analises/{id}/unblock")
    @Timed
    @Secured({ROLE_ADMIN, ROLE_USER, ROLE_GESTOR, ROLE_ANALISTA})
    public ResponseEntity<Analise> unblockAnalise(@Valid @RequestBody Analise analise) throws URISyntaxException {
        log.debug("REST request to block Analise : {}", analise);
        Optional<User> logged = userRepository.findOneWithAuthoritiesByLogin(SecurityUtils.getCurrentUserLogin());
        if (logged.isPresent() && !logged.get().verificarAuthority()) {
            return ResponseEntity.badRequest().headers(
                HeaderUtil.createFailureAlert(ENTITY_NAME, "notadmin", "Only admin users can block/unblock análises")).body(null);
        }
        linkFuncoesToAnalise(analise);
        analise.setbloqueiaAnalise(false);
        Analise result = analiseRepository.save(analise);
        unlinkAnaliseFromFuncoes(result);
        analiseSearchRepository.save(result);
        return ResponseEntity.ok().headers(HeaderUtil.unblockEntityUpdateAlert(ENTITY_NAME, analise.getId().toString()))
            .body(result);
    }

    /**
     * GET /analises : get all the analises.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of analises in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @GetMapping("/analises")
    @Timed
    public ResponseEntity<List<Analise>> getAllAnalises(@ApiParam Pageable pageable) throws URISyntaxException {
        log.debug("REST request to get a page of Analises");
        Page<Analise> page = analiseRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/analises");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET /analises/user/:userId : get all the analises for a particular user id and shared analises for its tipo_equipe.
     * If the user is a GESTOR or ADMIN, all analises are returned.
     *
     * @param userId   the user id to search for
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of analises in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @GetMapping("/analises/user/{userId}")
    @Timed
    public ResponseEntity getAllAnalisesByUserId(@PathVariable Long userId, @ApiParam Pageable pageable) throws URISyntaxException {
        Page<Analise> page;
        log.debug("REST request to get a page of Analises for user {}", userId);
        User foundUser = userRepository.findOneWithAuthoritiesById(userId);     // Recuperando dados do usuário recebido pela URL
        if (foundUser == null) {                                                // Se não encontrou dados do usuário logado é sinal que a coisa tá feia...
            return this.createBadRequest("userNotFound", "User not found in database");
        }                                                                       // Recuperando dados do usuário logado de fato para verificação de segurança
        Optional<User> logged = userRepository.findOneWithAuthoritiesByLogin(SecurityUtils.getCurrentUserLogin());
        if (!logged.isPresent() || !logged.get().getId().equals(foundUser.getId())) { // Verificando se o usuário está tentando acessar dados de outro usuário
            return this.createBadRequest("userSecurityBreachAtempt", "You are not allowed to access other user's data.");
        }
        page = this.gerarPage(logged.get(), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/analises");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * Função que gera uma página de análises filtradas de acordo com o perfil do usuário logado.
     *
     * @param user     Usuário cujo perfil será utilizado para filtrar a busca
     * @param pageable Parâmetro de paginação para geração da página
     * @return Retorna uma página de objetos Analise devidamente filtrada
     */
    private Page<Analise> gerarPage(User user, Pageable pageable) {
        if (!user.verificarAuthority()) {                    // Se o usuário logado é comum, filtra a lista de análises pelas equipes do mesmo
            // Requisitando uma página de análises com base na lista de Id's
            return analiseRepository.findById(filtrarListaAnalises(user), pageable);
        } else {                                            // Do contrário manda todas as análises
            return analiseRepository.findAll(pageable);     // Requisitando uma página de análises sem filtro
        }

    }

    /**
     * Função que filtra a lista de análises de acordo com o perfil do usuário logado
     *
     * @param usuario Dados dos usuário logado
     * @return Retorna uma lista contendo apenas id's de análises das equipes do usuário e compartilhadas com o mesmo
     */
    private List<Long> filtrarListaAnalises(User usuario) {
        List<Long> equipes = new ArrayList<>();
        List<Long> analises;

        for (TipoEquipe eqp : usuario.getTipoEquipes()) {   // Cria lista de equipes do usuário
            equipes.add(eqp.getId());
        }
        // Lista de Id's das análises da equipe do usuário
        analises = this.converteListaBigIntLong(analiseRepository.findAllByTipoEquipesId(equipes));
        // Adicionando a lista de Id's de análises compartilhadas com as equipes do usuário
        analises.addAll(this.converteListaBigIntLong(this.compartilhadaRepository.findByEquipeId(equipes)));
        return analises;
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

    /**
     * Função para construir reposta do tipo Bad Request informando o erro ocorrido.
     *
     * @param errorKey       Chave de erro que será incluída na resposta
     * @param defaultMessage Mensagem padrão que será incluída no log
     * @return ResponseEntity com uma Bad Request personalizada
     */

    private ResponseEntity createBadRequest(String errorKey, String defaultMessage) {
        return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, errorKey, defaultMessage))
            .body(null);
    }

    /**
     * GET /analises/:id : get the "id" analise.
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
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(analise));
    }

    /**
     * DELETE /analises/:id : delete the "id" analise.
     *
     * @param id the id of the analise to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/analises/{id}")
    @Timed
    @Secured({ROLE_ADMIN, ROLE_USER, ROLE_GESTOR, ROLE_ANALISTA})
    public ResponseEntity<Void> deleteAnalise(@PathVariable Long id) {
        log.debug("REST request to delete Analise : {}", id);
        analiseRepository.delete(id);
        analiseSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH /_search/analises?query=:query : search for the analise corresponding to the query.
     *
     * @param query the query of the analise search
     *              the pagination information
     * @return the result of the search
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @GetMapping("/_search/analises")
    @Timed
    // TODO todos os endpoint elastic poderiam ter o defaultValue impacta na paginacao do frontend
    public ResponseEntity<List<Analise>> searchAnalises(@RequestParam(defaultValue = "*") String query, @RequestParam String order, @RequestParam(name = "page") int pageNumber, @RequestParam int size, @RequestParam(defaultValue = "id") String sort) throws URISyntaxException {
        Sort.Direction sortOrder = PageUtils.getSortDirection(order);
        Pageable newPageable = new PageRequest(pageNumber, size, sortOrder, sort);
        log.debug(QUERY_MSG_CONST, query);
        validaRecuperarAnalise(query);
        Page<Analise> page = analiseSearchRepository.search(queryStringQuery(query), newPageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/analises");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * INCOMPLETA - Função pra criar query ElasticSearch que filtra as análises visualizadas pelo usuário. Caso esta função
     * receba o valor default para o endpoint "/_search/analises" ("*") será gerada uma query que irá buscar apenas as
     *
     * @param query A query ElasticSearch para ser verificada.
     */
    private void validaRecuperarAnalise(String query) {
        Long idUser;
        List<Long> idEquipes;
        User userData;
        String login;

        if (query.equals("*")) {
            login = SecurityUtils.getCurrentUserLogin();                                          // Descobrindo quem está logado
            userData = userRepository.findOneWithAuthoritiesByLogin(login).orElse(null);    // Carregando dados do usuário logado
            if (userData != null) {                                                               // Se conseguiu carregar os dados do usuário...
                idUser = userData.getId();                                                        // Pega id do usuário
                log.warn("====>> Found user_id: {}", idUser);
                idEquipes = userSearchRepository.findTipoEquipesById(idUser);                     // Recebe lista de equipes do usuário
                log.warn("====>> Found idEquipes: {}", idEquipes);
            } else {
                log.error("====>> Erro: idUser não encontrado.");
            }    // Deu ruim geral. Não encontrou os dados do usuário logado.
        }
    }

    /**
     * Retorna uma lista com todas as equipes que têm acesso àquela análise
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
     * Salva uma lista com todas as equipes que têm acesso àquela análise
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
     * Deleta um ou mais compartilhamentos de análise.
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

    @GetMapping("/_searchIdentificador/analises")
    @Timed
    // TODO todos os endpoint elastic poderiam ter o defaultValue impacta na paginacao do frontend
    public ResponseEntity<List<Analise>> searchIdentificadorAnalises(@RequestParam(defaultValue = "*") String query, @RequestParam String order, @RequestParam(name = PAGE) int pageNumber, @RequestParam int size, @RequestParam(defaultValue = "id") String sort) throws URISyntaxException {
        log.debug(QUERY_MSG_CONST, query);
        Sort.Direction sortOrder = PageUtils.getSortDirection(order);
        Pageable newPageable = new PageRequest(pageNumber, size, sortOrder, sort);

        QueryBuilder qb = QueryBuilders.matchQuery("identificadorAnalise", query);

        Page<Analise> page = analiseSearchRepository.search((qb), newPageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_searchIdentificador/analises");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @GetMapping("/_searchSistema/analises")
    @Timed
    // TODO todos os endpoint elastic poderiam ter o defaultValue impacta na paginacao do frontend
    public ResponseEntity<List<Analise>> searchSistemaAnalises(@RequestParam(defaultValue = "*") String query, @RequestParam String order, @RequestParam(name = PAGE) int pageNumber, @RequestParam int size, @RequestParam(defaultValue = "id") String sort) throws URISyntaxException {
        log.debug(QUERY_MSG_CONST, query);
        Sort.Direction sortOrder = PageUtils.getSortDirection(order);
        Pageable newPageable = new PageRequest(pageNumber, size, sortOrder, sort);

        QueryBuilder qb = QueryBuilders.matchQuery("nomeSistema", query);

        Page<Analise> page = analiseSearchRepository.search((qb), newPageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_searchSistema/analises");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @GetMapping("/_searchMetodoContagem/analises")
    @Timed
    // TODO todos os endpoint elastic poderiam ter o defaultValue impacta na paginacao do frontend
    public ResponseEntity<List<Analise>> searchMetodoContagemAnalises(@RequestParam(defaultValue = "*") String query, @RequestParam String order, @RequestParam(name = PAGE) int pageNumber, @RequestParam int size, @RequestParam(defaultValue = "id") String sort) throws URISyntaxException {
        log.debug(QUERY_MSG_CONST, query);
        Sort.Direction sortOrder = PageUtils.getSortDirection(order);
        Pageable newPageable = new PageRequest(pageNumber, size, sortOrder, sort);

        QueryBuilder qb = QueryBuilders.matchQuery("metodoContagemString", query);

        Page<Analise> page = analiseSearchRepository.search((qb), newPageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_searchMetodoContagem/analises");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @GetMapping("/_searchOrganizacao/analises")
    @Timed
    // TODO todos os endpoint elastic poderiam ter o defaultValue impacta na paginacao do frontend
    public ResponseEntity<List<Analise>> searchOrganizacaoAnalises(@RequestParam(defaultValue = "*") String query, @RequestParam String order, @RequestParam(name = PAGE) int pageNumber, @RequestParam int size, @RequestParam(defaultValue = "id") String sort) throws URISyntaxException {
        log.debug(QUERY_MSG_CONST, query);
        Sort.Direction sortOrder = PageUtils.getSortDirection(order);
        Pageable newPageable = new PageRequest(pageNumber, size, sortOrder, sort);

        QueryBuilder qb = QueryBuilders.matchQuery("organizacao.nome", query);

        Page<Analise> page = analiseSearchRepository.search((qb), newPageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_searchOrganizacao/analises");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @GetMapping("/_searchEquipe/analises")
    @Timed
    // TODO todos os endpoint elastic poderiam ter o defaultValue impacta na paginacao do frontend
    public ResponseEntity<List<Analise>> searchEquipeAnalises(@RequestParam(defaultValue = "*") String query, @RequestParam String order, @RequestParam(name = PAGE) int pageNumber, @RequestParam int size, @RequestParam(defaultValue = "id") String sort) throws URISyntaxException {
        log.debug(QUERY_MSG_CONST, query);
        Sort.Direction sortOrder = PageUtils.getSortDirection(order);
        Pageable newPageable = new PageRequest(pageNumber, size, sortOrder, sort);

        QueryBuilder qb = QueryBuilders.matchQuery("equipeResponsavel.nome", query);

        Page<Analise> page = analiseSearchRepository.search((qb), newPageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_searchEquipe/analises");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
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
     * GET /analisesEquipes : get all the analises.findByIdAnalises
     *
     * @return the ResponseEntity with status 200 (OK) and the list of analises in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @GetMapping("/analises/grupos")
    @Timed
    public ResponseEntity<List<Grupo>> getAllAnalisesEquipes(@RequestParam(defaultValue = "asc")  String order, @RequestParam(defaultValue = "0", name = PAGE)
        int pageNumber, @RequestParam(defaultValue = "20")  int size, @RequestParam(defaultValue = "id") String sort) throws URISyntaxException {
        Sort.Direction sortOrder = PageUtils.getSortDirection(order);
        Pageable pageable = new PageRequest(pageNumber, size, sortOrder, sort);

        Optional<User> logged = userRepository.findOneWithAuthoritiesByLogin(SecurityUtils.getCurrentUserLogin());

        List<Long> equipesIds;
        List<BigInteger> idsAnalises;

        equipesIds = userRepository.findUserEquipes(logged.get().getId());
        if (equipesIds.size() != 0) {
            idsAnalises = analiseRepository.listAnalisesEquipe(equipesIds);
            if (idsAnalises.size() != 0) {
                Page<Grupo> page = grupoRepository.findByIdAnalises(this.converteListaBigIntLong(idsAnalises), pageable);
                HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/analises/equipes");
                return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
            }
        }



        return new ResponseEntity<>(new ArrayList<Grupo>(), null, HttpStatus.OK);



    }
}


