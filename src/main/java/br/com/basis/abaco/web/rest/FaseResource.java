package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.Fase;
import br.com.basis.abaco.service.FaseService;
import br.com.basis.abaco.service.dto.FaseDTO;
import br.com.basis.abaco.service.exception.RelatorioException;
import br.com.basis.abaco.utils.PageUtils;
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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * REST controller for managing Fase.
 */
@RestController
@RequestMapping("/api")
public class FaseResource {

    private final Logger log = LoggerFactory.getLogger(FaseResource.class);

    private static final String ENTITY_NAME = "fase";

    private final FaseService faseService;

    public FaseResource( FaseService faseService) {
        this.faseService = faseService;
    }

    @PostMapping("/fases")
    @Timed
    @Secured({"ROLE_ADMIN", "ROLE_USER", "ROLE_GESTOR"})
    public ResponseEntity<FaseDTO> createFase(@RequestBody Fase fase) throws URISyntaxException {
        log.debug("REST request to save Fase : {}", fase);
        if (fase.getId() != null) {
            return ResponseEntity.badRequest().headers(
                HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new fase cannot already have an ID"))
                .body(null);
        }
        FaseDTO result = faseService.save(fase);
        return ResponseEntity.created(new URI("/api/fases/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PutMapping("/fases")
    @Timed
    @Secured({"ROLE_ADMIN", "ROLE_USER", "ROLE_GESTOR"})
    public ResponseEntity<FaseDTO> updateFase(@RequestBody Fase fase) throws URISyntaxException {
        log.debug("REST request to update Fase : {}", fase);
        if (fase.getId() == null) {
            return createFase(fase);
        }
        FaseDTO result = faseService.save(fase);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, fase.getId().toString()))
            .body(result);
    }

    @GetMapping("/fases")
    @Timed
    public List<FaseDTO> getAllFases() {
        log.debug("REST request to get all Fases");
        return faseService.getFasesDTO();
    }

    @GetMapping("/fases/{id}")
    @Timed
    public ResponseEntity<FaseDTO> getFaseDTO(@PathVariable Long id) {
        log.debug("REST request to get Fase : {}", id);
        FaseDTO fase = faseService.getFaseDTO(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(fase));
    }

    @DeleteMapping("/fases/{id}")
    @Timed
    @Secured({"ROLE_ADMIN", "ROLE_USER", "ROLE_GESTOR"})
    public ResponseEntity<Void> deleteFase(@PathVariable Long id) {
        log.debug("REST request to delete Fase : {}", id);
        faseService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @GetMapping("/_search/fases")
    @Timed
    public ResponseEntity<List<Fase>> searchFases(
        @RequestParam(defaultValue = "*") String query,
        @RequestParam String order,
        @RequestParam(name="page") int pageNumber,
        @RequestParam int size,
        @RequestParam(defaultValue="id") String sort) throws URISyntaxException {
        log.debug("REST request to search Fases for query {}", query);
        Sort.Direction sortOrder = PageUtils.getSortDirection(order);
        Pageable newPageable = new PageRequest(pageNumber, size, sortOrder, sort);

        Page<Fase> page = faseService.getFases(queryStringQuery(query), newPageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/fases");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @GetMapping(value = "/tipoFase/exportacao/{tipoRelatorio}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @Timed
    public ResponseEntity<InputStreamResource> gerarRelatorioExportacao(
        @PathVariable String tipoRelatorio,
        @RequestParam(defaultValue = "*") String query) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream = faseService.getRelatorioBAOS(tipoRelatorio, query);
        return DynamicExporter.output(byteArrayOutputStream,
            "relatorio." + tipoRelatorio);
    }


}
