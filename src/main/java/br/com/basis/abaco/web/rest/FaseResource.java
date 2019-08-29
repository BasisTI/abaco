package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.service.FaseService;
import br.com.basis.abaco.service.dto.DropdownDTO;
import br.com.basis.abaco.service.dto.FaseDTO;
import br.com.basis.abaco.service.dto.filter.FaseFiltroDTO;
import br.com.basis.abaco.service.exception.RelatorioException;
import br.com.basis.dynamicexports.util.DynamicExporter;
import com.codahale.metrics.annotation.Timed;
import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FaseResource {

    private final Logger log = LoggerFactory.getLogger(FaseResource.class);

    private final FaseService service;

    @PostMapping("/fases")
    @Timed
    @Secured({"ROLE_ADMIN", "ROLE_USER", "ROLE_GESTOR"})
    public ResponseEntity<Void> save(@RequestBody FaseDTO fase) {
        log.debug("REST request to save Fase : {}", fase);
        service.save(fase);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/fases/{id}")
    @Timed
    public ResponseEntity<FaseDTO> findOne(@PathVariable Long id) {
        log.debug("REST request to get Fase : {}", id);
        FaseDTO fase = service.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(fase));
    }
    
    @GetMapping("/fases/dropdown")
    @Timed
    public ResponseEntity<List<DropdownDTO>> getDropdown() {
        log.debug("REST request to get Fase drodown");
        List<DropdownDTO> dropdownDTOList = service.getFaseDropdown();
        return ResponseEntity.ok().body(dropdownDTOList);
    }

    @DeleteMapping("/fases/{id}")
    @Timed
    @Secured({"ROLE_ADMIN", "ROLE_USER", "ROLE_GESTOR"})
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
    public ResponseEntity<InputStreamResource> gerarRelatorioExportacao(
        @PathVariable String tipoRelatorio,
        @RequestBody FaseFiltroDTO filter,
        @ApiParam Pageable pageable) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream = service.getRelatorioBAOS(tipoRelatorio, filter, pageable);
        return DynamicExporter.output(byteArrayOutputStream,
            "relatorio." + tipoRelatorio);
    }
}
