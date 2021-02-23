package br.com.basis.abaco.web.rest;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.codahale.metrics.annotation.Timed;
import br.com.basis.abaco.domain.novo.Fase;
import br.com.basis.abaco.service.FaseService;
import br.com.basis.abaco.service.dto.FaseDTO;
import br.com.basis.abaco.service.dto.filter.FaseFiltroDTO;
import br.com.basis.abaco.service.dto.novo.DropdownDTO;
import br.com.basis.abaco.service.exception.RelatorioException;
import br.com.basis.abaco.service.relatorio.RelatorioFaseColunas;
import br.com.basis.abaco.utils.AbacoUtil;
import br.com.basis.abaco.utils.PageUtils;
import br.com.basis.dynamicexports.service.DynamicExportsService;
import br.com.basis.dynamicexports.util.DynamicExporter;
import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;
import net.sf.dynamicreports.report.exception.DRException;
import net.sf.jasperreports.engine.JRException;

@RestController
@RequestMapping("/api")
public class FaseResource {

    private final Logger log = LoggerFactory.getLogger(FaseResource.class);
    private final FaseService service;
    private final DynamicExportsService dynamicExportsService;

    @GetMapping("/fases")
    @Timed
    @Secured({ "ROLE_ADMIN", "ROLE_USER", "ROLE_GESTOR" })
    public ResponseEntity<Page<Fase>> list(@RequestParam(defaultValue = "ASC") String order,
            @RequestParam(defaultValue = "0", name = "page") int pageNumber,
            @RequestParam(defaultValue = "20") int size, @RequestParam(defaultValue = "id") String sort,
            @RequestParam(required = false) String nome) {
        log.debug("REST request to search Fases for query {}", nome);
        Sort.Direction sortOrder = PageUtils.getSortDirection(order);
        Pageable pageable = new PageRequest(pageNumber, size, sortOrder, sort);
        Page<Fase> page = service.list(nome, pageable);
        return new ResponseEntity<Page<Fase>>(page, HttpStatus.OK);
    }

    @PostMapping("/fases")
    @Timed
    @Secured({ "ROLE_ADMIN", "ROLE_USER", "ROLE_GESTOR" })
    public ResponseEntity<Void> save(@RequestBody Fase fase) {
        log.debug("REST request to save Fase : {}", fase);
        service.save(fase);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/fases/{id}")
    @Timed
    public ResponseEntity<Fase> findOne(@PathVariable Long id) {
        log.debug("REST request to get Fase : {}", id);
        Fase fase = service.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(fase));
    }

    @GetMapping("/fases/dropdown")
    @Timed
    public ResponseEntity<List<DropdownDTO>> getDropdown() {
        log.debug("REST request to get Fase drodown");
        List<DropdownDTO> dropdownDTOList = service.getDropdown();
        return ResponseEntity.ok().body(dropdownDTOList);
    }

    @DeleteMapping("/fases/{id}")
    @Timed
    @Secured({ "ROLE_ADMIN", "ROLE_USER", "ROLE_GESTOR" })
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.debug("REST request to delete Fase : {}", id);
        service.delete(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("fases/page")
    @Timed
    public ResponseEntity<Page<FaseDTO>> getPage(@ApiParam Pageable pageable, @RequestBody FaseFiltroDTO filter) {
        log.debug("REST request to search Fases for query {}", filter);
        Page<FaseDTO> page = service.getPage(filter, pageable);
        return new ResponseEntity<Page<FaseDTO>>(page, HttpStatus.OK);
    }

    @PostMapping(value = "/fases/exportacao/{tipoRelatorio}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @Timed
    public ResponseEntity<InputStreamResource> gerarRelatorioExportacao(@PathVariable String tipoRelatorio,
            @RequestBody FaseFiltroDTO filter, @ApiParam Pageable pageable)
            throws RelatorioException, ClassNotFoundException, JRException, DRException {
        Page<FaseDTO> fasePage = service.getPage(filter, pageable);
        ByteArrayOutputStream byteArrayOutputStream = null;
        try {
            byteArrayOutputStream = dynamicExportsService.export(new RelatorioFaseColunas(), fasePage, tipoRelatorio,
                    Optional.empty(), Optional.ofNullable(AbacoUtil.REPORT_LOGO_PATH),
                    Optional.ofNullable(AbacoUtil.getReportFooter()));
        } catch (ClassNotFoundException e) {
            throw e;
        } catch (JRException e) {
            throw e;
        } catch (DRException e) {
            throw e;
        }
        return DynamicExporter.output(byteArrayOutputStream, "relatorio." + tipoRelatorio);
    }

    public FaseResource(FaseService service, DynamicExportsService dynamicExportsService) {
        this.service = service;
        this.dynamicExportsService = dynamicExportsService;
    }
}
