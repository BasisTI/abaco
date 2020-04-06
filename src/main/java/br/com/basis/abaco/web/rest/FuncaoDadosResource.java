package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.domain.Der;
import br.com.basis.abaco.domain.FuncaoDados;
import br.com.basis.abaco.domain.Rlr;
import br.com.basis.abaco.domain.enumeration.TipoFatorAjuste;
import br.com.basis.abaco.repository.AnaliseRepository;
import br.com.basis.abaco.repository.FuncaoDadosRepository;
import br.com.basis.abaco.repository.search.AnaliseSearchRepository;
import br.com.basis.abaco.repository.search.FuncaoDadosSearchRepository;
import br.com.basis.abaco.service.FuncaoDadosService;
import br.com.basis.abaco.service.dto.DropdownDTO;
import br.com.basis.abaco.service.dto.FuncaoDadoAnaliseDTO;
import br.com.basis.abaco.service.dto.FuncaoDadoApiDTO;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import com.codahale.metrics.annotation.Timed;
import io.github.jhipster.web.util.ResponseUtil;
import org.apache.commons.lang3.math.NumberUtils;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

import java.math.BigDecimal;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * REST controller for managing FuncaoDados.
 */
@RestController
@RequestMapping("/api")
public class FuncaoDadosResource {

    private static final int decimalPlace = 2;
    public static final String WHITE_SPACE = " ";
    public static final char PERCENTUAL = '%';
    public static final String PF = "PF";
    private final Logger log = LoggerFactory.getLogger(FuncaoDadosResource.class);
    private static final String ENTITY_NAME = "funcaoDados";
    private final FuncaoDadosRepository funcaoDadosRepository;
    private final FuncaoDadosSearchRepository funcaoDadosSearchRepository;
    private final FuncaoDadosService funcaoDadosService;
    private final AnaliseRepository analiseRepository;
    private final AnaliseSearchRepository analiseSearchRepository;

    public FuncaoDadosResource(FuncaoDadosRepository funcaoDadosRepository,
                               FuncaoDadosSearchRepository funcaoDadosSearchRepository, FuncaoDadosService funcaoDadosService, AnaliseRepository analiseRepository, AnaliseSearchRepository analiseSearchRepository) {
        this.funcaoDadosRepository = funcaoDadosRepository;
        this.funcaoDadosSearchRepository = funcaoDadosSearchRepository;
        this.funcaoDadosService = funcaoDadosService;
        this.analiseRepository = analiseRepository;
        this.analiseSearchRepository = analiseSearchRepository;
    }

    /**
     * POST  /funcao-dados : Create a new funcaoDados.
     *
     * @param funcaoDados the funcaoDados to create
     * @return the ResponseEntity with status 201 (Created) and with body the new funcaoDados, or with status 400 (Bad Request) if the funcaoDados has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/funcao-dados/{idAnalise}")
    @Timed
    @Secured({"ROLE_ADMIN", "ROLE_USER", "ROLE_GESTOR"})
    public ResponseEntity<FuncaoDados> createFuncaoDados(@PathVariable Long idAnalise, @RequestBody FuncaoDados funcaoDados) throws URISyntaxException {
        log.debug("REST request to save FuncaoDados : {}", funcaoDados);
        Analise analise = analiseRepository.findOne(idAnalise);
        funcaoDados.setAnalise(analise);
        if (funcaoDados.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new funcaoDados cannot already have an ID")).body(null);
        }
        BigDecimal pfTotal = new BigDecimal(analise.getPfTotal()).setScale(decimalPlace);
        BigDecimal pfAdjust = new BigDecimal(analise.getAdjustPFTotal()).setScale(decimalPlace);
        pfTotal = pfTotal.add(funcaoDados.getGrossPF());
        pfAdjust = pfAdjust.add(funcaoDados.getPf());
        analise.setPfTotal(pfTotal.toString());
        analise.setAdjustPFTotal(pfAdjust.toString());
        analiseRepository.save(analise);
        analiseSearchRepository.save(analise);
        FuncaoDados result = funcaoDadosRepository.save(funcaoDados);
        return ResponseEntity.created(new URI("/api/funcao-dados/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
                .body(result);
    }

    /**
     * PUT  /funcao-dados : Updates an existing funcaoDados.
     *
     * @param funcaoDados the funcaoDados to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated funcaoDados,
     * or with status 400 (Bad Request) if the funcaoDados is not valid,
     * or with status 500 (Internal Server Error) if the funcaoDados couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/funcao-dados/{id}")
    @Timed
    @Secured({"ROLE_ADMIN", "ROLE_USER", "ROLE_GESTOR"})
    public ResponseEntity<FuncaoDados> updateFuncaoDados(@PathVariable Long id, @RequestBody FuncaoDados funcaoDados) throws URISyntaxException {
        log.debug("REST request to update FuncaoDados : {}", funcaoDados);
        FuncaoDados funcaoDadosOld = funcaoDadosRepository.findById(id);
        if (funcaoDados.getId() == null) {
            return createFuncaoDados(funcaoDados.getAnalise().getId(), funcaoDados);
        }
        Analise analise = analiseRepository.findOne(funcaoDadosOld.getAnalise().getId());
        BigDecimal pfTotal = new BigDecimal(analise.getPfTotal()).setScale(decimalPlace);
        BigDecimal pfAdjust = new BigDecimal(analise.getAdjustPFTotal()).setScale(decimalPlace);
        pfTotal = pfTotal.add(funcaoDados.getGrossPF()).subtract(funcaoDadosOld.getGrossPF());
        pfAdjust = pfAdjust.add(funcaoDados.getPf()).subtract(funcaoDadosOld.getPf());
        analise.setPfTotal(pfTotal.toString());
        analise.setAdjustPFTotal(pfAdjust.toString());
        funcaoDados.setAnalise(analise);
        analiseRepository.save(analise);
        analiseSearchRepository.save(analise);
        FuncaoDados result = funcaoDadosRepository.save(funcaoDados);
        funcaoDadosSearchRepository.save(result);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, funcaoDados.getId().toString()))
                .body(result);
    }

    /**
     * GET  /funcao-dados : get all the funcaoDados.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of funcaoDados in body
     */
    @GetMapping("/funcao-dados")
    @Timed
    public List<FuncaoDados> getAllFuncaoDados() {
        log.debug("REST request to get all FuncaoDados");
        List<FuncaoDados> funcaoDados = funcaoDadosRepository.findAll();
        funcaoDados.stream().filter(f -> f.getAnalise() != null).forEach(f -> {
            if (f.getAnalise().getFuncaoDados() != null) {
                f.getAnalise().getFuncaoDados().clear();
            }
            if (f.getAnalise().getFuncaoTransacaos() != null) {
                f.getAnalise().getFuncaoTransacaos().clear();
            }
        });
        return funcaoDados;
    }

    /**
     * GET  /funcao-dados/:id : get the "id" funcaoDados.
     *
     * @param id the id of the funcaoDados to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the funcaoDados, or with status 404 (Not Found)
     */
    @GetMapping("/funcao-dados/{id}")
    @Timed
    public ResponseEntity<FuncaoDadoApiDTO> getFuncaoDados(@PathVariable Long id) {
        log.debug("REST request to get FuncaoDados : {}", id);
        FuncaoDados funcaoDados = funcaoDadosRepository.findOne(id);
        if (funcaoDados.getAnalise().getFuncaoDados() != null) {
            funcaoDados.getAnalise().getFuncaoDados().clear();
        }
        if (funcaoDados.getAnalise().getFuncaoTransacaos() != null) {
            funcaoDados.getAnalise().getFuncaoTransacaos().clear();
        }

        ModelMapper modelMapper = new ModelMapper();

        FuncaoDadoApiDTO funcaoDadosDTO = modelMapper.map(funcaoDados, FuncaoDadoApiDTO.class);

        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(funcaoDadosDTO));
    }


    @GetMapping("/funcao-dados-dto/analise/{id}")
    @Timed
    public ResponseEntity<List<FuncaoDadoAnaliseDTO>> getFuncaoDadosByAnalise(@PathVariable Long id) {
        Set<FuncaoDados> lstFuncaoDados = funcaoDadosRepository.findByAnaliseId(id);
        List<FuncaoDadoAnaliseDTO> lstFuncaoDadosDTO = lstFuncaoDados.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(lstFuncaoDadosDTO));
    }

    /**
     * GET  /funcao-dados/analise/:id : get the "id" analise.
     *
     * @param id the id of the funcaoDados to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the funcaoDados, or with status 404 (Not Found)
     */
    @GetMapping("/funcao-dados/analise/{id}")
    @Timed
    public Set<FuncaoDados> getFuncaoDadosAnalise(@PathVariable Long id) {
        log.debug("REST request to get FuncaoDados : {}", id);
        Set<FuncaoDados> funcaoDados = null;
        funcaoDados = funcaoDadosRepository.findByAnaliseId(id);
        return funcaoDados;
    }

    /**
     * DELETE  /funcao-dados/:id : delete the "id" funcaoDados.
     *
     * @param id the id of the funcaoDados to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/funcao-dados/{id}")
    @Timed
    @Secured({"ROLE_ADMIN", "ROLE_USER", "ROLE_GESTOR"})
    public ResponseEntity<Void> deleteFuncaoDados(@PathVariable Long id) {
        log.debug("REST request to delete FuncaoDados : {}", id);
        FuncaoDados funcaoDados = funcaoDadosRepository.findById(id);
        Analise analise = analiseRepository.findOne(funcaoDados.getAnalise().getId());
        BigDecimal pfTotal = new BigDecimal(analise.getPfTotal()).setScale(decimalPlace);
        BigDecimal pfAdjust = new BigDecimal(analise.getAdjustPFTotal()).setScale(decimalPlace);
        pfTotal = pfTotal.subtract(funcaoDados.getGrossPF());
        pfAdjust = pfAdjust.subtract(funcaoDados.getPf());
        analise.setPfTotal(pfTotal.toString());
        analise.setAdjustPFTotal(pfAdjust.toString());
        analiseRepository.save(analise);
        analiseSearchRepository.save(analise);
        funcaoDadosRepository.delete(id);
        funcaoDadosSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/funcao-dados?query=:query : search for the funcaoDados corresponding
     * to the query.
     *
     * @param query the query of the funcaoDados search
     * @return the result of the search
     */
    @GetMapping("/_search/funcao-dados")
    @Timed
    public List<FuncaoDados> searchFuncaoDados(@RequestParam(defaultValue = "*") String query) {
        log.debug("REST request to search FuncaoDados for query {}", query);
        return StreamSupport
                .stream(funcaoDadosSearchRepository.search(queryStringQuery(query)).spliterator(), false)
                .collect(Collectors.toList());
    }

    @GetMapping("/funcao-dados/drop-down")
    @Timed
    public List<DropdownDTO> getFuncaoDadosDropdown() {
        log.debug("REST request to get dropdown FuncaoDados");
        return funcaoDadosService.getFuncaoDadosDropdown();
    }

    @GetMapping("/funcao-dados/{idAnalise}/{idfuncionalidade}/{idModulo}")
    @Timed
    public ResponseEntity<Boolean> existFuncaoDados(@PathVariable Long idAnalise, @PathVariable Long idfuncionalidade, @PathVariable Long idModulo, @RequestParam String name, @RequestParam(required = false) Long id) {
        log.debug("REST request to exist FuncaoDados");
        Boolean existInAnalise;
        if (id != null && id > 0) {

            existInAnalise = funcaoDadosRepository.existsByNameAndAnalise_IdAndFuncionalidade_IdAndFuncionalidade_Modulo_IdAndIdNot(name, idAnalise, idfuncionalidade, idModulo, id);
        } else {
            existInAnalise = funcaoDadosRepository.existsByNameAndAnalise_IdAndFuncionalidade_IdAndFuncionalidade_Modulo_Id(name, idAnalise, idfuncionalidade, idModulo);
        }
        return ResponseEntity.ok(existInAnalise);
    }

    private FuncaoDadoAnaliseDTO convertToDto(FuncaoDados funcaoDados) {
        FuncaoDadoAnaliseDTO funcaoDadoAnaliseDTO = new ModelMapper().map(funcaoDados, FuncaoDadoAnaliseDTO.class);
        funcaoDadoAnaliseDTO.setRlrFilter(getValueRlr(funcaoDados));
        funcaoDadoAnaliseDTO.setDerFilter(getValueDer(funcaoDados));
        funcaoDadoAnaliseDTO.setFatorAjusteFilter(getFatorAjusteFilter(funcaoDados));
        funcaoDadoAnaliseDTO.setHasSustantation(getSustantation(funcaoDados));
        return funcaoDadoAnaliseDTO;
    }

    private String getFatorAjusteFilter(FuncaoDados funcaoDados) {
        StringBuilder fatorAjustFilterSB = new StringBuilder();
        if (!(funcaoDados.getFatorAjuste().getCodigo().isEmpty())) {
            fatorAjustFilterSB.append(funcaoDados.getFatorAjuste().getCodigo());
            fatorAjustFilterSB.append(WHITE_SPACE);
        }
        if (!(funcaoDados.getFatorAjuste().getOrigem().isEmpty())) {
            fatorAjustFilterSB.append(funcaoDados.getFatorAjuste().getOrigem());
            fatorAjustFilterSB.append(WHITE_SPACE);
        }
        if (!(funcaoDados.getFatorAjuste().getNome().isEmpty())) {
            fatorAjustFilterSB.append(funcaoDados.getFatorAjuste().getNome());
            fatorAjustFilterSB.append(WHITE_SPACE);
        }
        fatorAjustFilterSB.append(funcaoDados.getFatorAjuste().getFator().setScale(decimalPlace));
        fatorAjustFilterSB.append(WHITE_SPACE);

        if (funcaoDados.getFatorAjuste().getTipoAjuste() == TipoFatorAjuste.PERCENTUAL) {
            fatorAjustFilterSB.append(PERCENTUAL);
        } else {
            fatorAjustFilterSB.append(PF);
        }
        return fatorAjustFilterSB.toString();
    }

    private Integer getValueDer(FuncaoDados funcaoDados) {
        int dersValues = funcaoDados.getDers().size();
        if (dersValues == 1) {
            Der der = funcaoDados.getDers().iterator().next();
            return der.getValor() == null ? dersValues : der.getValor();
        } else {
            return dersValues;
        }
    }

    private Integer getValueRlr(FuncaoDados funcaoDados) {
        int rlrsValues = funcaoDados.getRlrs().size();
        if (rlrsValues == 1) {
            Rlr rlr = funcaoDados.getRlrs().iterator().next();
            return rlr.getValor() == null ? rlrsValues : rlr.getValor();
        } else {
            return rlrsValues;
        }
    }

    private Boolean getSustantation(FuncaoDados funcaoDados) {
        return funcaoDados.getSustantation() != null && !(funcaoDados.getSustantation().isEmpty());
    }
}
