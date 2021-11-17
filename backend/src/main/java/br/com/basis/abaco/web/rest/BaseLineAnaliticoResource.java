package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.BaseLineAnaliticoFD;
import br.com.basis.abaco.domain.BaseLineAnaliticoFT;
import br.com.basis.abaco.domain.BaseLineSintetico;
import br.com.basis.abaco.domain.FuncaoDados;
import br.com.basis.abaco.reports.rest.RelatorioBaselineRest;
import br.com.basis.abaco.repository.FuncaoDadosRepository;
import br.com.basis.abaco.repository.FuncaoTransacaoRepository;
import br.com.basis.abaco.repository.search.BaseLineAnaliticoFDSearchRepository;
import br.com.basis.abaco.repository.search.BaseLineAnaliticoFTSearchRepository;
import br.com.basis.abaco.repository.search.BaseLineSinteticoSearchRepository;
import br.com.basis.abaco.service.BaselineAnaliseService;
import br.com.basis.abaco.service.dto.BaselineAnaliticoDTO;
import br.com.basis.abaco.utils.PageUtils;
import com.codahale.metrics.annotation.Timed;
import net.sf.jasperreports.engine.JRException;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.SearchQuery;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * REST controller for managing BaseLineAnalitico.
 */
@RestController
@RequestMapping("/api")
public class BaseLineAnaliticoResource {

    private final Logger log = LoggerFactory.getLogger(BaseLineAnaliticoResource.class);
    private final BaseLineAnaliticoFDSearchRepository baseLineAnaliticoFDSearchRepository;
    private final BaseLineAnaliticoFTSearchRepository baseLineAnaliticoFTSearchRepository;
    private final FuncaoDadosRepository funcaoDadosRepository;
    private final FuncaoTransacaoRepository funcaoTransacaoRepository;
    private final BaseLineSinteticoSearchRepository baseLineSinteticoSearchRepository;
    private final BaselineAnaliseService baselineAnaliseService;
    private RelatorioBaselineRest relatorioBaselineRest;
    private static final String PAGE = "page";
    private static final String DBG_MSG_FD = "REST request to get FD BaseLineAnalitico : {}";
    private final ElasticsearchTemplate elasticsearchTemplate;

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private HttpServletResponse response;

    @Autowired
    private ModelMapper modelMapper;

    public BaseLineAnaliticoResource(
                                     FuncaoDadosRepository funcaoDadosRepository,
                                     FuncaoTransacaoRepository funcaoTransacaoRepository,
                                     BaseLineSinteticoSearchRepository baseLineSinteticoSearchRepository,
                                     BaseLineAnaliticoFDSearchRepository baseLineAnaliticoFDSearchRepository,
                                     BaselineAnaliseService baselineAnaliseService,
                                     BaseLineAnaliticoFTSearchRepository baseLineAnaliticoFTSearchRepository,
                                     ElasticsearchTemplate elasticsearchTemplate) {
        this.funcaoTransacaoRepository = funcaoTransacaoRepository;
        this.baseLineSinteticoSearchRepository = baseLineSinteticoSearchRepository;
        this.funcaoDadosRepository = funcaoDadosRepository;
        this.baseLineAnaliticoFDSearchRepository = baseLineAnaliticoFDSearchRepository;
        this.baselineAnaliseService = baselineAnaliseService;
        this.baseLineAnaliticoFTSearchRepository = baseLineAnaliticoFTSearchRepository;
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    private BaseLineSintetico recuperarBaselinePorSistema(Long id) {
        return baseLineSinteticoSearchRepository.findOneByIdsistema(id);
    }


    /**
     * GET  /base-line-analiticos : get all the baseLineAnaliticos.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of baseLineAnaliticos in body
     */
    @GetMapping("/baseline-analiticos")
    @Timed
    public Set<BaseLineAnaliticoFD> getAllBaseLineAnaliticos() {
        log.debug("REST request to get all BaseLineAnaliticos");
        return new HashSet<>(baseLineAnaliticoFDSearchRepository.findAll());
    }


    public List<BaseLineAnaliticoFD> getBaseLineAnaliticoFD(@PathVariable Long id) {
        log.debug(DBG_MSG_FD, id);
        return baseLineAnaliticoFDSearchRepository.findByIdsistemaOrderByNameAsc(id);
    }

    @GetMapping("/baseline-analiticos/fd/{id}")
    @Timed
    @Secured("ROLE_ABACO_BASELINE_CONSULTAR")
    public List<BaselineAnaliticoDTO> getBaseLineAnaliticoFDDTO(@PathVariable Long id) {
        log.debug(DBG_MSG_FD, id);
        List<BaseLineAnaliticoFD> baseLineAnaliticos = baseLineAnaliticoFDSearchRepository.findByIdsistemaOrderByNameAsc(id);
        List<BaselineAnaliticoDTO> baselineAnaliticoDTOS = new ArrayList<>();
        baseLineAnaliticos.forEach(baseLineAnalitico ->
            baselineAnaliticoDTOS.add(modelMapper.map(baseLineAnalitico, BaselineAnaliticoDTO.class))
        );
        baselineAnaliticoDTOS.forEach(baselineAnaliticoDTO ->
            baselineAnaliticoDTO.setIdfuncionalidade(pesquisarFuncionalidadeFD(baselineAnaliticoDTO.getIdfuncaodados()))
        );
        return baselineAnaliticoDTOS;
    }


    public List<BaseLineAnaliticoFT> getBaseLineAnaliticoFT(@PathVariable Long id) {
        log.debug("REST request to get FT BaseLineAnalitico : {}", id);
        return baseLineAnaliticoFTSearchRepository.findByIdsistemaOrderByNameAsc(id);
    }

    @GetMapping("/baseline-analiticos/ft/{id}")
    @Timed
    @Secured("ROLE_ABACO_BASELINE_CONSULTAR")
    public List<BaselineAnaliticoDTO> getBaseLineAnaliticoFTDTO(@PathVariable Long id) {
        log.debug("REST request to get FT BaseLineAnaliticoDTO : {}", id);
        List<BaseLineAnaliticoFT> baseLineAnaliticos = baseLineAnaliticoFTSearchRepository.findByIdsistemaOrderByNameAsc(id);
        List<BaselineAnaliticoDTO> baselineAnaliticoDTOS = new ArrayList<>();

        baseLineAnaliticos.forEach(baseLineAnalitico ->
            baselineAnaliticoDTOS.add(modelMapper.map(baseLineAnalitico, BaselineAnaliticoDTO.class))
        );

        baselineAnaliticoDTOS.forEach(baselineAnaliticoDTO ->
            baselineAnaliticoDTO.setIdfuncionalidade(pesquisarFuncionalidadeFT(baselineAnaliticoDTO.getIdfuncaodados()))
        );
        return baselineAnaliticoDTOS;
    }

    private Long pesquisarFuncionalidadeFT(Long idfuncaodados) {
        return funcaoTransacaoRepository.getIdFuncionalidade(idfuncaodados);
    }

    private Long pesquisarFuncionalidadeFD(Long idfuncaodados) {
        return funcaoDadosRepository.getIdFuncionalidade(idfuncaodados);
    }


    @GetMapping("/baseline-analiticos/funcao-dados/{id}")
    @Timed
    public List<FuncaoDados> getFDBaseline(@PathVariable Long id) {
        log.debug(DBG_MSG_FD, id);
        List<BaseLineAnaliticoFD> integerList = baseLineAnaliticoFDSearchRepository.findByIdsistemaOrderByNameAsc(id);
        List<FuncaoDados> fds = new ArrayList<>();
        for (BaseLineAnaliticoFD baseLineAnalitico : integerList) {
            Long idFuncaoDados = baseLineAnalitico.getIdfuncaodados();
            if (idFuncaoDados != null) {
                FuncaoDados fd = funcaoDadosRepository.findById(idFuncaoDados);
                fds.add(fd);
            }
        }
        return fds;
    }

    @GetMapping("/downloadPdfBaselineBrowser/{id}")
    @Timed
    @Secured("ROLE_ABACO_BASELINE_EXPORTAR")
    public @ResponseBody
    byte[] downloadPdfBaselineBrowser(@PathVariable Long id) throws URISyntaxException, IOException, JRException {
        relatorioBaselineRest = new RelatorioBaselineRest(this.response, this.request);
        log.debug("REST request to generate report Analise baseline in browser : {}", recuperarBaselinePorSistema(id));
        return relatorioBaselineRest.downloadPdfBaselineBrowser(recuperarBaselinePorSistema(id), getBaseLineAnaliticoFD(id), getBaseLineAnaliticoFT(id));
    }

    @GetMapping("/baseline-analiticos/fd/{id}/equipe/{idEquipe}")
    @Timed
    @Secured("ROLE_ABACO_BASELINE_CONSULTAR")
    public Page<BaseLineAnaliticoFD> getBaseLineAnaliticoFDEquipe(@PathVariable String id,
                                                                @PathVariable String idEquipe,
                                                                @RequestParam(defaultValue = "ASC") String order,
                                                                @RequestParam(defaultValue = "0", name = PAGE) int pageNumber,
                                                                @RequestParam(defaultValue = "20") int size,
                                                                @RequestParam(defaultValue = "id") String sort) {
        log.debug(DBG_MSG_FD, id);
        Sort.Direction sortOrder = PageUtils.getSortDirection(order);
        Pageable pageable = new PageRequest(pageNumber, size, sortOrder, sort);
        BoolQueryBuilder qb = baselineAnaliseService.getBoolQueryBuilder(id, idEquipe);
        SearchQuery searchQuery = new NativeSearchQueryBuilder().withQuery(qb).withPageable(pageable).build();
        Page<BaseLineAnaliticoFD> lstPage = elasticsearchTemplate.queryForPage(searchQuery, BaseLineAnaliticoFD.class);
        return new PageImpl(lstPage.getContent(), pageable, lstPage.getTotalElements());
    }

    @GetMapping("/baseline-analiticos/ft/{id}/equipe/{idEquipe}")
    @Timed
    @Secured("ROLE_ABACO_BASELINE_CONSULTAR")
    public Page<BaseLineAnaliticoFT> getBaseLineAnaliticoFTEquipe(@PathVariable String id,
                                                                @PathVariable String idEquipe,
                                                                @RequestParam(defaultValue = "ASC") String order,
                                                                @RequestParam(defaultValue = "0", name = PAGE) int pageNumber,
                                                                @RequestParam(defaultValue = "20") int size,
                                                                @RequestParam(defaultValue = "id") String sort) {
        log.debug(DBG_MSG_FD, id);
        Sort.Direction sortOrder = PageUtils.getSortDirection(order);
        Pageable pageable = new PageRequest(pageNumber, size, sortOrder, sort);
        BoolQueryBuilder qb = baselineAnaliseService.getBoolQueryBuilder(id, idEquipe);
        SearchQuery searchQuery = new NativeSearchQueryBuilder().withQuery(qb).withPageable(pageable).build();
        Page<BaseLineAnaliticoFT> lstPage = elasticsearchTemplate.queryForPage(searchQuery, BaseLineAnaliticoFT.class);
        return new PageImpl(lstPage.getContent(), pageable, lstPage.getTotalElements());
    }

    @GetMapping(value = "/exportar-excel/{id}/{modelo}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @Secured("ROLE_ABACO_BASELINE_EXPORTAR")
    public ResponseEntity<byte[]> exportarExcel(@PathVariable Long id, @PathVariable Long modelo) throws IOException{
        BaseLineSintetico baseLineSintetico = recuperarBaselinePorSistema(id);
        List<BaseLineAnaliticoFD> baseLineAnaliticoFD = getBaseLineAnaliticoFD(id);
        List<BaseLineAnaliticoFT> baseLineAnaliticoFT = getBaseLineAnaliticoFT(id);
        return baselineAnaliseService.exportarExcel(baseLineSintetico, baseLineAnaliticoFD, baseLineAnaliticoFT, modelo);
    }
}
