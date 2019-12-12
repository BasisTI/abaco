package br.com.basis.abaco.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.multiMatchQuery;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.io.ByteArrayOutputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import javax.transaction.Transactional;
import javax.validation.Valid;

import br.com.basis.abaco.domain.*;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
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

import br.com.basis.abaco.repository.FuncaoDadosRepository;
import br.com.basis.abaco.repository.FuncaoDadosVersionavelRepository;
import br.com.basis.abaco.repository.SistemaRepository;
import br.com.basis.abaco.repository.search.SistemaSearchRepository;
import br.com.basis.abaco.service.SistemaService;
import br.com.basis.abaco.service.dto.SistemaDropdownDTO;
import br.com.basis.abaco.service.exception.RelatorioException;
import br.com.basis.abaco.service.relatorio.RelatorioSistemaColunas;
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
 * REST controller for managing Sistema.
 */
@RestController
@RequestMapping("/api")
public class SistemaResource {

  private final Logger log = LoggerFactory.getLogger(SistemaResource.class);

  private static final String ENTITY_NAME = "sistema";

    private static final String DBG_MSG_SIS = "REST request to search Sistemas for query {}";

  private final SistemaRepository sistemaRepository;

  private final SistemaSearchRepository sistemaSearchRepository;

  private final FuncaoDadosVersionavelRepository funcaoDadosVersionavelRepository;

  private final FuncaoDadosRepository funcaoDadosRepository;

  private final DynamicExportsService dynamicExportsService;

    private final SistemaService sistemaService;

  private static final String ROLE_ANALISTA = "ROLE_ANALISTA";

    private static final String ROLE_ADMIN = "ROLE_ADMIN";

    private static final String ROLE_USER = "ROLE_USER";

    private static final String ROLE_GESTOR = "ROLE_GESTOR";

    private static  final String PAGE = "page";

  public SistemaResource(
      SistemaRepository sistemaRepository,
      SistemaSearchRepository sistemaSearchRepository,
      FuncaoDadosVersionavelRepository funcaoDadosVersionavelRepository,
            FuncaoDadosRepository funcaoDadosRepository, DynamicExportsService dynamicExportsService,
            SistemaService sistemaService) {

    this.sistemaRepository = sistemaRepository;
    this.sistemaSearchRepository = sistemaSearchRepository;
    this.funcaoDadosVersionavelRepository = funcaoDadosVersionavelRepository;
    this.funcaoDadosRepository = funcaoDadosRepository;
    this.dynamicExportsService = dynamicExportsService;
        this.sistemaService = sistemaService;
  }

  /**
   * POST /sistemas : Create a new sistema.
   * @param sistema the sistema to create
   * @return the ResponseEntity with status 201 (Created)
   * and with body the new sistema, or with status 400 (Bad Request)
   * if the sistema has already an ID
   * @throws URISyntaxException if the Location URI syntax is incorrect
   */
  @PostMapping("/sistemas")
  @Timed
    @Secured({ROLE_ADMIN, ROLE_USER, ROLE_GESTOR, ROLE_ANALISTA})
  public ResponseEntity<Sistema> createSistema(@Valid @RequestBody Sistema sistema) throws URISyntaxException {
    log.debug("REST request to save Sistema : {}", sistema);
    if (sistema.getId() != null) {
      return ResponseEntity.badRequest().headers(
          HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new sistema cannot already have an ID"))
          .body(null);
    }
    Sistema linkedSistema = linkSistemaToModuleToFunctionalities(sistema);
    Sistema result = sistemaRepository.save(linkedSistema);
    sistemaSearchRepository.save(result);
    return ResponseEntity.created(new URI("/api/sistemas/" + result.getId()))
        .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString())).body(result);
  }

  private Sistema linkSistemaToModuleToFunctionalities(Sistema sistema) {
    Sistema linkedSistema = copySistema(sistema);
    Set<Modulo> modulos = linkedSistema.getModulos();
    Optional.ofNullable(modulos).orElse(Collections.emptySet())
      .forEach(m -> {
        m.setSistema(linkedSistema);
        Optional.ofNullable(m.getFuncionalidades())
          .orElse(Collections.emptySet())
          .parallelStream().forEach(f -> f.setModulo(m));
      });
    return linkedSistema;
  }

  private Sistema copySistema(Sistema sistema) {
    Sistema copy = new Sistema();
    copy.setId(sistema.getId());
    copy.setSigla(sistema.getSigla());
    copy.setNome(sistema.getNome());
    copy.setTipoSistema(sistema.getTipoSistema());
    copy.setNumeroOcorrencia(sistema.getNumeroOcorrencia());
    copy.setOrganizacao(sistema.getOrganizacao());
    copy.setModulos(Optional.ofNullable(sistema.getModulos())
      .map((lista) -> new HashSet<>(lista))
      .orElse(new HashSet<>()));
    return copy;
  }

  /**
   * PUT /sistemas : Updates an existing sistema.
   * @param sistema the sistema to update
   * @return the ResponseEntity with status 200 (OK) and with body the updated
   * sistema, or with status 400 (Bad Request) if the sistema is not
   * valid, or with status 500 (Internal Server Error) if the sistema
   * couldnt be updated
   * @throws URISyntaxException if the Location URI syntax is incorrect
   */
  @PutMapping("/sistemas")
  @Timed
    @Secured({ROLE_ADMIN, ROLE_USER, ROLE_GESTOR, ROLE_ANALISTA})
  public ResponseEntity<Sistema> updateSistema(@Valid @RequestBody Sistema sistema) throws URISyntaxException {
    log.debug("REST request to update Sistema : {}", sistema);
    if (sistema.getId() == null) {
      return createSistema(sistema);
    }
    Sistema linkedSistema = linkSistemaToModuleToFunctionalities(sistema);
    Sistema result = sistemaRepository.save(linkedSistema);
    sistemaSearchRepository.save(result);
    return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, sistema.getId().toString())).body(result);
  }

  /**
   * GET /sistemas : get all the sistemas.
   * @return the ResponseEntity with status 200 (OK) and the list of sistemas in body
   */
  @PostMapping("/sistemas/organizations")
  @Timed
    @Secured({ROLE_ADMIN, ROLE_USER, ROLE_GESTOR, ROLE_ANALISTA})
  public List<Sistema> getAllSistemasByOrganization(@Valid @RequestBody Organizacao organization) {
    log.debug("REST request to get all Sistemas");
    return sistemaRepository.findAllByOrganizacao(organization);
  }

  @GetMapping("/sistemas/organizacao/{idOrganizacao}")
  @Timed
  @Transactional
  public Set<Sistema> findAllSystemOrg(@PathVariable Long idOrganizacao) {
        log.debug("REST request to get all Sistemas by Organizacao");
    return sistemaRepository.findAllByOrganizacaoId(idOrganizacao);
  }

    @GetMapping("/sistemas/drop-down")
    @Timed
    public List<SistemaDropdownDTO> getSistemaDropdown() {
        log.debug("REST request to get dropdown Sistemas");
        return sistemaService.getSistemaDropdown();
    }

  /**
   * GET /sistemas/:id : get the "id" sistema.
   * @param id the id of the sistema to retrieve
   * @return the ResponseEntity with status 200 (OK) and with body
   * the sistema, or with status 404 (Not Found)
   */
  @GetMapping("/sistemas/{id}")
  @Timed
  public ResponseEntity<Sistema> getSistema(@PathVariable Long id) {
    log.debug("REST request to get Sistema : {}", id);
    Sistema sistema = sistemaRepository.findOne(id);
    return ResponseUtil.wrapOrNotFound(Optional.ofNullable(sistema));
  }

  // TODO essa ou nova rota para retornar somente o nome das funcoes
  @GetMapping("/sistemas/{id}/funcao-dados")
  public Set<FuncaoDadosVersionavel> getFuncoesDeDadosVersionaveisBySistema(@PathVariable Long id) {
    return funcaoDadosVersionavelRepository.findAllBySistemaId(id);
  }

  @GetMapping("/sistemas/{id}/funcao-dados-versionavel/{nome}")
  public FuncaoDados recuperarFuncaoDadosPorIdNome(@PathVariable Long id, @PathVariable String nome) {

    Optional<FuncaoDadosVersionavel> funcaoDadosVersionavelOptional = funcaoDadosVersionavelRepository
        .findOneByNomeIgnoreCaseAndSistemaId(nome, id);

    if (funcaoDadosVersionavelOptional.isPresent()) {
      FuncaoDadosVersionavel fdv = funcaoDadosVersionavelOptional.get();
      return funcaoDadosRepository.findFirstByFuncaoDadosVersionavelIdOrderByAuditUpdatedOnDesc(fdv.getId()).get();
    }

    return null;
  }

  /**
   * DELETE /sistemas/:id : delete the "id" sistema.
   * @param id the id of the sistema to delete
   * @return the ResponseEntity with status 200 (OK)
   */
  @DeleteMapping("/sistemas/{id}")
  @Timed
    @Secured({ROLE_ADMIN, ROLE_USER, ROLE_GESTOR, ROLE_ANALISTA})
  public ResponseEntity<Void> deleteSistema(@PathVariable Long id) {
    log.debug("REST request to delete Sistema : {}", id);
    if (sistemaRepository.exists(id)) {
      return ResponseEntity.badRequest().headers(
               HeaderUtil.createFailureAlert(ENTITY_NAME, "analiseexists", "This System can not be deleted"))
               .body(null);
    }

    sistemaRepository.delete(id);
    sistemaSearchRepository.delete(id);
    return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();

  }

  /**
   * SEARCH /_search/sistemas?query=:query : search for the sistema corresponding to the query.
   * @param query the query of the sistema search
   * @return the result of the search
   * @throws URISyntaxException
   */

    @GetMapping("/_search/sistemas")
    @Timed
    public ResponseEntity<List<Sistema>> searchSistemas(@RequestParam(defaultValue = "*") String query,
                                                        @RequestParam String order, @RequestParam(name = PAGE) int pageNumber, @RequestParam int size,
                                                        @RequestParam(defaultValue = "id") String sort) throws URISyntaxException {
        Sort.Direction sortOrder = PageUtils.getSortDirection(order);
        Pageable newPageable = new PageRequest(pageNumber, size, sortOrder, sort);

        Page<Sistema> page = sistemaSearchRepository.search(queryStringQuery(query), newPageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/sistemas");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @GetMapping(value = "/sistema/exportacao/{tipoRelatorio}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @Timed
    public ResponseEntity<InputStreamResource> gerarRelatorioExportacao(@PathVariable String tipoRelatorio, @RequestParam(defaultValue = "*") String query) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream;
        try {
            new NativeSearchQueryBuilder().withQuery(multiMatchQuery(query)).build();
            Page<Sistema> result =  sistemaSearchRepository.search(queryStringQuery(query), dynamicExportsService.obterPageableMaximoExportacao());
            byteArrayOutputStream = dynamicExportsService.export(new RelatorioSistemaColunas(), result, tipoRelatorio, Optional.empty(), Optional.ofNullable(AbacoUtil.REPORT_LOGO_PATH), Optional.ofNullable(AbacoUtil.getReportFooter()));
        } catch (DRException | ClassNotFoundException | JRException | NoClassDefFoundError e) {
            log.error(e.getMessage(), e);
            throw new RelatorioException(e);
        }
        return DynamicExporter.output(byteArrayOutputStream,
            "relatorio." + tipoRelatorio);
    }
}
