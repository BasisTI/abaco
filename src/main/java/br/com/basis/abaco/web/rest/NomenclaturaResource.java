package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.Nomenclatura;
import br.com.basis.abaco.repository.NomenclaturaRepository;
import br.com.basis.abaco.repository.search.NomenclaturaSearchRepository;
import br.com.basis.abaco.security.AuthoritiesConstants;
import br.com.basis.abaco.service.NomenclaturaService;
import br.com.basis.abaco.service.dto.NomenclaturaDTO;
import br.com.basis.abaco.service.exception.RelatorioException;
import br.com.basis.abaco.service.relatorio.RelatorioEquipeColunas;
import br.com.basis.abaco.utils.AbacoUtil;
import br.com.basis.abaco.utils.PageUtils;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import br.com.basis.abaco.web.rest.util.PaginationUtil;
import br.com.basis.dynamicexports.service.DynamicExportsService;
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
import java.util.List;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

@RestController
@RequestMapping("/api")
public class NomenclaturaResource {

    private final Logger log = LoggerFactory.getLogger(Nomenclatura.class);
    private static final String ENTITY_NAME = "Nomenclatura";
    private final NomenclaturaRepository nomenclaturaRepository;
    private final NomenclaturaSearchRepository nomenclaturaSearchRepository;
    private final DynamicExportsService dynamicExportsService;
    private final NomenclaturaService nomenclaturaService;

    public NomenclaturaResource( NomenclaturaRepository nomenclaturaRepository,
                    NomenclaturaSearchRepository nomenclaturaSearchRepository,
                    DynamicExportsService dynamicExportsService,
                    NomenclaturaService nomenclaturaService){

        this.dynamicExportsService = dynamicExportsService;
        this.nomenclaturaRepository = nomenclaturaRepository;
        this.nomenclaturaSearchRepository = nomenclaturaSearchRepository;
        this.nomenclaturaService = nomenclaturaService;

    }


    @PostMapping("/nomenclatura")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.GESTOR, AuthoritiesConstants.ANALISTA})
    public ResponseEntity<NomenclaturaDTO> createNomenclatura(@Valid @RequestBody NomenclaturaDTO nomenclaturaDTO)
        throws URISyntaxException {
        log.debug("REST request to save Nomenclatura : {}", nomenclaturaDTO);
        if (nomenclaturaDTO.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists",
                "A new Nomenclatura cannot already have an ID")).body(null);
        }
        NomenclaturaDTO result = nomenclaturaService.save(nomenclaturaDTO);
        return ResponseEntity.created(new URI("/api/nomenclatura/" + result.getId())).headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString())).body(result);
    }

    @PutMapping("/nomenclatura")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.GESTOR, AuthoritiesConstants.ANALISTA})
    public ResponseEntity<NomenclaturaDTO> updateNomenclatura(@Valid @RequestBody NomenclaturaDTO nomenclatura)
        throws URISyntaxException {
        log.debug("REST request to update Nomenclatura : {}", nomenclatura);
        if (nomenclatura.getId() == null) {
            return createNomenclatura(nomenclatura);
        }
        NomenclaturaDTO result = nomenclaturaService.save(nomenclatura);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, nomenclatura.getId().toString())).body(result);
    }

    @GetMapping("/nomenclatura/{id}")
    @Timed
    public ResponseEntity<Nomenclatura> getNomenclatura(@PathVariable Long id) {
        log.debug("REST request to get Nomenclatura : {}", id);
        Nomenclatura nomenclatura = nomenclaturaRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(nomenclatura));
    }

    @DeleteMapping("/nomenclatura/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.GESTOR, AuthoritiesConstants.ANALISTA})
    public ResponseEntity<Void> deleteNomenclatura(@PathVariable Long id) {
        log.debug("REST request to delete Nomenclatura : {}", id);

        nomenclaturaRepository.delete(id);
        nomenclaturaSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @GetMapping("/_search/nomenclatura")
    @Timed
    public ResponseEntity<List<Nomenclatura>> searchNomenclatura(@RequestParam(defaultValue = "*") String query, @RequestParam(defaultValue = "ASC", required = false) String order, @RequestParam(name = "page") int pageNumber, @RequestParam int size, @RequestParam(defaultValue = "id") String sort) throws URISyntaxException {
        log.debug("REST request to search for a page of Nomenclatura for query {}", query);

        Sort.Direction sortOrder = PageUtils.getSortDirection(order);
        Pageable newPageable = new PageRequest(pageNumber, size, sortOrder, sort);

        Page<Nomenclatura> page = nomenclaturaSearchRepository.search(queryStringQuery(query), newPageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/nomenclatura");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @GetMapping(value = "/nomenclatura/exportacao/{tipoRelatorio}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @Timed
    public ResponseEntity<InputStreamResource> gerarRelatorioExportacao(@PathVariable String tipoRelatorio, @RequestParam(defaultValue = "*") String query) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream;
        try {
            new NativeSearchQueryBuilder().withQuery(multiMatchQuery(query)).build();
            Page<Nomenclatura> result = nomenclaturaSearchRepository.search(queryStringQuery(query), dynamicExportsService.obterPageableMaximoExportacao());
            byteArrayOutputStream = dynamicExportsService.export(new RelatorioEquipeColunas(), result, tipoRelatorio, Optional.empty(), Optional.ofNullable(AbacoUtil.REPORT_LOGO_PATH), Optional.ofNullable(AbacoUtil.getReportFooter()));
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new RelatorioException(e);
        }
        return DynamicExporter.output(byteArrayOutputStream,
            "relatorio." + tipoRelatorio);
    }


}
