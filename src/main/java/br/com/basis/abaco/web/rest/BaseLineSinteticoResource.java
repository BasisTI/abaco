package br.com.basis.abaco.web.rest;

import com.codahale.metrics.annotation.Timed;
import br.com.basis.abaco.domain.BaseLineSintetico;

import static org.elasticsearch.index.query.QueryBuilders.multiMatchQuery;

import java.io.ByteArrayOutputStream;
import br.com.basis.abaco.service.exception.RelatorioException;
import br.com.basis.abaco.service.relatorio.RelatorioBaselineSinteticoColunas;
import br.com.basis.abaco.utils.AbacoUtil;
import br.com.basis.dynamicexports.service.DynamicExportsService;
import br.com.basis.dynamicexports.util.DynamicExporter;
import net.sf.dynamicreports.report.exception.DRException;
import net.sf.jasperreports.engine.JRException;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.http.MediaType;

import br.com.basis.abaco.repository.BaseLineSinteticoRepository;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing BaseLineSintetico.
 */
@RestController
@RequestMapping("/api")
public class BaseLineSinteticoResource {

    private final Logger log = LoggerFactory.getLogger(BaseLineSinteticoResource.class);
    private final BaseLineSinteticoRepository baseLineSinteticoRepository;

    private final DynamicExportsService dynamicExportsService;


    public BaseLineSinteticoResource(BaseLineSinteticoRepository baseLineSinteticoRepository, DynamicExportsService dynamicExportsService) {
        this.baseLineSinteticoRepository = baseLineSinteticoRepository;
        this.dynamicExportsService = dynamicExportsService;
    }

    @GetMapping("/baseline-sinteticos")
    @Timed
    public List<BaseLineSintetico> getAllBaseLineSinteticos() {
        log.debug("REST request to get all BaseLineSinteticos");
        return baseLineSinteticoRepository.getBaseLineSintetico();
    }

    @GetMapping("/baseline-sinteticos/{id}")
    @Timed
    public ResponseEntity<BaseLineSintetico> getBaseLineSintetico(@PathVariable Long id) {
        log.debug("REST request to get all BaseLineSinteticos: {}", id);
        BaseLineSintetico funcaoDados = baseLineSinteticoRepository.getBaseLineSinteticoId(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(funcaoDados));
    }

    @GetMapping("/baseline-sinteticos/{id}/equipe/{idEquipe}")
    @Timed
    public ResponseEntity<BaseLineSintetico> getBaseLineSinteticoEquipe(
        @PathVariable Long id,@PathVariable Long idEquipe) {
        log.debug("REST request to get all BaseLineSinteticos: {}", id);
        BaseLineSintetico funcaoDados = baseLineSinteticoRepository.getBaseLineSinteticoIdEquipe(id,idEquipe);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(funcaoDados));
    }

    @GetMapping(value = "/baseline/exportacao/{tipoRelatorio}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @Timed
    public ResponseEntity<InputStreamResource> gerarRelatorioExportacao(@PathVariable String tipoRelatorio, @RequestParam(defaultValue = "*") String query) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream;
        try {
            new NativeSearchQueryBuilder().withQuery(multiMatchQuery(query)).build();
            Page<BaseLineSintetico> result =  baseLineSinteticoRepository.getBaseLineSinteticoRelatorio(dynamicExportsService.obterPageableMaximoExportacao());
            byteArrayOutputStream = dynamicExportsService.export(new RelatorioBaselineSinteticoColunas(), result, tipoRelatorio, Optional.empty(), Optional.ofNullable(AbacoUtil.REPORT_LOGO_PATH), Optional.ofNullable(AbacoUtil.getReportFooter()));
        } catch (DRException | ClassNotFoundException | JRException | NoClassDefFoundError e) {
            log.error(e.getMessage(), e);
            throw new RelatorioException(e);
        }
        return DynamicExporter.output(byteArrayOutputStream,
            "relatorio." + tipoRelatorio);
    }


}
