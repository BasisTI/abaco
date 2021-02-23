package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.Status;
import br.com.basis.abaco.repository.StatusRepository;
import br.com.basis.abaco.repository.search.StatusSearchRepository;
import br.com.basis.abaco.service.StatusService;
import br.com.basis.abaco.service.dto.StatusDTO;
import br.com.basis.abaco.service.exception.RelatorioException;
import br.com.basis.abaco.service.relatorio.RelatorioEquipeColunas;
import br.com.basis.abaco.service.relatorio.RelatorioStatusColunas;
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

import br.com.basis.abaco.domain.Status;
import br.com.basis.abaco.repository.StatusRepository;
import br.com.basis.abaco.repository.search.StatusSearchRepository;
import br.com.basis.abaco.service.StatusService;
import br.com.basis.abaco.service.dto.StatusDTO;
import br.com.basis.abaco.service.exception.RelatorioException;
import br.com.basis.abaco.utils.PageUtils;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import br.com.basis.abaco.web.rest.util.PaginationUtil;
import br.com.basis.dynamicexports.util.DynamicExporter;
import io.github.jhipster.web.util.ResponseUtil;

@RestController
@RequestMapping("/api")
public class StatusResource {
    private final Logger log = LoggerFactory.getLogger(Status.class);

    private static final String ENTITY_NAME = "Status";
    private final StatusRepository statusRepository;
    private final StatusSearchRepository statusSearchRepository;
    private final StatusService statusService;
    private static final String ROLE_ANALISTA = "ROLE_ANALISTA";
    private static final String ROLE_ADMIN = "ROLE_ADMIN";
    private static final String ROLE_USER = "ROLE_USER";
    private static final String ROLE_GESTOR = "ROLE_GESTOR";

    public StatusResource(StatusRepository statusRepository, StatusSearchRepository statusSearchRepository,
            StatusService statusService) {
        this.statusRepository = statusRepository;
        this.statusSearchRepository = statusSearchRepository;
        this.statusService = statusService;
    }

    @PostMapping("/status")
    @Timed
    @Secured({ ROLE_ADMIN, ROLE_USER, ROLE_GESTOR, ROLE_ANALISTA })
    public ResponseEntity<StatusDTO> createStatus(@Valid @RequestBody StatusDTO status) throws URISyntaxException {
        log.debug("REST request to save Status : {}", status);
        if (status.getId() != null) {
            return ResponseEntity.badRequest().headers(
                    HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new Status cannot already have an ID"))
                    .body(null);
        }
        StatusDTO result = statusService.save(status);
        return ResponseEntity.created(new URI("/api/status/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString())).body(result);
    }

    @PutMapping("/status")
    @Timed
    @Secured({ ROLE_ADMIN, ROLE_USER, ROLE_GESTOR, ROLE_ANALISTA })
    public ResponseEntity<StatusDTO> updateStatus(@Valid @RequestBody StatusDTO status) throws URISyntaxException {
        log.debug("REST request to update Status : {}", status);
        if (status.getId() == null) {
            return createStatus(status);
        }
        StatusDTO result = statusService.save(status);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, status.getId().toString()))
                .body(result);
    }

    @GetMapping("/status/list-active")
    @Timed
    public List<Status> getLstStatusActive() {
        log.debug("REST request to get List Active Status");
        return statusService.findAllActive();
    }

    @GetMapping("/status/list")
    @Timed
    public List<Status> getLstStatus() {
        log.debug("REST request to get list Status");
        return statusService.findAll();
    }

    @GetMapping("/status/{id}")
    @Timed
    public ResponseEntity<Status> getStatus(@PathVariable Long id) {
        log.debug("REST request to get Status : {}", id);
        Status status = statusRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(status));
    }

    @DeleteMapping("/status/{id}")
    @Timed
    @Secured({ ROLE_ADMIN, ROLE_USER, ROLE_GESTOR, ROLE_ANALISTA })
    public ResponseEntity<Void> deleteStatus(@PathVariable Long id) {
        log.debug("REST request to delete Status : {}", id);

        statusRepository.delete(id);
        statusSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @GetMapping("/_search/status")
    @Timed
    public ResponseEntity<List<Status>> searchStatus(@RequestParam(defaultValue = "*") String query,
            @RequestParam(defaultValue = "ASC", required = false) String order,
            @RequestParam(name = "page") int pageNumber, @RequestParam int size,
            @RequestParam(defaultValue = "id") String sort) throws URISyntaxException {
        log.debug("REST request to search for a page of Status for query {}", query);

        Sort.Direction sortOrder = PageUtils.getSortDirection(order);
        Pageable newPageable = new PageRequest(pageNumber, size, sortOrder, sort);

        Page<Status> page = statusSearchRepository.search(queryStringQuery(query), newPageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/status");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @PostMapping(value = "/status/exportacao/{tipoRelatorio}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @Timed
    public ResponseEntity<InputStreamResource> gerarRelatorioExportacao(@PathVariable String tipoRelatorio,
                                                                        @RequestParam(defaultValue = "*") String query) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream = statusService.gerarRelatorio(query, tipoRelatorio);
        return DynamicExporter.output(byteArrayOutputStream, "relatorio." + tipoRelatorio);
    }

    @GetMapping(value = "/status/exportacao-arquivo", produces = MediaType.APPLICATION_PDF_VALUE)
    @Timed
    public ResponseEntity<byte[]> gerarRelatorioImprimir(@RequestParam(defaultValue = "*") String query) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream = statusService.gerarRelatorio(query, "pdf");
        return new ResponseEntity<byte[]>(byteArrayOutputStream.toByteArray(), HttpStatus.OK);
    }
}
