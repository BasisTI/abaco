package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.BaseLineAnalitico;
import br.com.basis.abaco.domain.BaseLineSintetico;
import br.com.basis.abaco.repository.BaseLineAnaliticoRepository;
import br.com.basis.abaco.repository.BaseLineSinteticoRepository;
import br.com.basis.abaco.repository.search.BaseLineAnaliticoSearchRepository;
import br.com.basis.abaco.repository.search.BaseLineSinteticoSearchRepository;
import br.com.basis.abaco.service.exception.RelatorioException;
import br.com.basis.abaco.service.relatorio.RelatorioBaselineSinteticoColunas;
import br.com.basis.abaco.utils.AbacoUtil;
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
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing BaseLineSintetico.
 */
@RestController
@RequestMapping("/api")
public class BaseLineSinteticoResource {

    private final Logger log = LoggerFactory.getLogger(BaseLineSinteticoResource.class);
    private final BaseLineSinteticoSearchRepository baseLineSinteticoSearchRepository;
    private final BaseLineSinteticoRepository baseLineSinteticoRepository;
    private final BaseLineAnaliticoSearchRepository baseLineAnaliticoSearchRepository;
    private final BaseLineAnaliticoRepository baseLineAnaliticoRepository;
    private final DynamicExportsService dynamicExportsService;

    public BaseLineSinteticoResource(DynamicExportsService dynamicExportsService,
                                     BaseLineSinteticoSearchRepository baseLineSinteticoSearchRepository,
                                     BaseLineAnaliticoSearchRepository baseLineAnaliticoSearchRepository,
                                     BaseLineAnaliticoRepository baseLineAnaliticoRepository,
                                     BaseLineSinteticoRepository baseLineSinteticoRepository ) {
        this.dynamicExportsService = dynamicExportsService;
        this.baseLineSinteticoSearchRepository = baseLineSinteticoSearchRepository;
        this.baseLineAnaliticoRepository = baseLineAnaliticoRepository;
        this.baseLineAnaliticoSearchRepository = baseLineAnaliticoSearchRepository;
        this.baseLineSinteticoRepository = baseLineSinteticoRepository;
    }

    @GetMapping("/baseline-sinteticos")
    @Timed
    public List<BaseLineSintetico> getAllBaseLineSinteticos(@RequestParam(value = "idSistema", required = false) Long idSistema) {
         log.debug("REST request to get all BaseLineSinteticos");
        if(idSistema != null){
            return baseLineSinteticoSearchRepository.findAllByIdsistema(idSistema);
        }else {
            Iterable<BaseLineSintetico> lst  = baseLineSinteticoSearchRepository.findAll();
            List<BaseLineSintetico> lstBaseLineSintetico = new ArrayList<>();
            lst.forEach(lstBaseLineSintetico::add);
            return lstBaseLineSintetico;
        }
    }

    @GetMapping("/baseline-sinteticos/update/{id}")
    @Timed
    public ResponseEntity<BaseLineSintetico> updateBaseLineSintetico(@PathVariable(value = "id") Long id) {
        log.debug("REST request to update BaseLineSinteticos");
        if(id == null){
            ResponseEntity.badRequest().body(null);
        }
        BaseLineSintetico baseLineSintetico =  baseLineSinteticoRepository.findOneByIdsistema(id);
        BaseLineSintetico result =  baseLineSinteticoSearchRepository.save(baseLineSintetico);
        List<BaseLineAnalitico> lstAnalitico = baseLineAnaliticoRepository.getAllByIdsistema(id);
        lstAnalitico.forEach(baseLineAnalitico ->  baseLineAnaliticoSearchRepository.save(baseLineAnalitico));
        return ResponseEntity.ok(result);
    }



    @GetMapping("/baseline-sinteticos/{id}")
    @Timed
    public ResponseEntity<BaseLineSintetico> getBaseLineSintetico(@PathVariable Long id) {
        log.debug("REST request to get all BaseLineSinteticos: {}", id);
        BaseLineSintetico funcaoDados = baseLineSinteticoSearchRepository.findOneByIdsistema(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(funcaoDados));
    }

    @GetMapping("/baseline-sinteticos/{id}/equipe/{idEquipe}")
    @Timed
    public ResponseEntity<BaseLineSintetico> getBaseLineSinteticoEquipe(
        @PathVariable Long id,@PathVariable Long idEquipe) {
        log.debug("REST request to get all BaseLineSinteticos: {}", id);
        BaseLineSintetico funcaoDados = baseLineSinteticoSearchRepository.findOneByIdsistemaAndEquipeResponsavelId(id,idEquipe);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(funcaoDados));
    }

    @GetMapping(value = "/baseline/exportacao/{tipoRelatorio}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @Timed
    public ResponseEntity<InputStreamResource> gerarRelatorioExportacao(@PathVariable String tipoRelatorio, @RequestParam(defaultValue = "*") String query) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream;
        try {
            new NativeSearchQueryBuilder().withQuery(multiMatchQuery(query)).build();
            Page<BaseLineSintetico> result =  baseLineSinteticoSearchRepository.findAll(dynamicExportsService.obterPageableMaximoExportacao());
            byteArrayOutputStream = dynamicExportsService.export(new RelatorioBaselineSinteticoColunas(), result, tipoRelatorio, Optional.empty(), Optional.ofNullable(AbacoUtil.REPORT_LOGO_PATH), Optional.ofNullable(AbacoUtil.getReportFooter()));
        } catch (DRException | ClassNotFoundException | JRException | NoClassDefFoundError e) {
            log.error(e.getMessage(), e);
            throw new RelatorioException(e);
        }
        return DynamicExporter.output(byteArrayOutputStream,
            "relatorio." + tipoRelatorio);
    }


}
