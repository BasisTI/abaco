package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.BaseLineAnalitico;
import br.com.basis.abaco.domain.BaseLineSintetico;
import br.com.basis.abaco.domain.FuncaoDados;
import br.com.basis.abaco.reports.rest.RelatorioBaselineRest;
import br.com.basis.abaco.repository.FuncaoDadosRepository;
import br.com.basis.abaco.repository.FuncaoTransacaoRepository;
import br.com.basis.abaco.repository.search.BaseLineAnaliticoSearchRepository;
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
    private final BaseLineAnaliticoSearchRepository baseLineAnaliticoSearchRepository;
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


    public BaseLineAnaliticoResource(
                                     FuncaoDadosRepository funcaoDadosRepository,
                                     FuncaoTransacaoRepository funcaoTransacaoRepository,
                                     BaseLineSinteticoSearchRepository baseLineSinteticoSearchRepository,
                                     BaseLineAnaliticoSearchRepository baseLineAnaliticoSearchRepository,
                                     BaselineAnaliseService baselineAnaliseService,
                                     ElasticsearchTemplate elasticsearchTemplate) {
        this.funcaoTransacaoRepository = funcaoTransacaoRepository;
        this.baseLineSinteticoSearchRepository = baseLineSinteticoSearchRepository;
        this.funcaoDadosRepository = funcaoDadosRepository;
        this.baseLineAnaliticoSearchRepository = baseLineAnaliticoSearchRepository;
        this.baselineAnaliseService = baselineAnaliseService;
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
    public Set<BaseLineAnalitico> getAllBaseLineAnaliticos() {
        log.debug("REST request to get all BaseLineAnaliticos");
        return new HashSet<>(baseLineAnaliticoSearchRepository.findAll());
    }


    public List<BaseLineAnalitico> getBaseLineAnaliticoFD(@PathVariable Long id) {
        log.debug(DBG_MSG_FD, id);
        return baseLineAnaliticoSearchRepository.findByIdsistemaAndTipoOrderByNameAsc(id, "fd");
    }

    @GetMapping("/baseline-analiticos/fd/{id}")
    @Timed
    public List<BaselineAnaliticoDTO> getBaseLineAnaliticoFDDTO(@PathVariable Long id) {
        log.debug(DBG_MSG_FD, id);
        List<BaseLineAnalitico> baseLineAnaliticos = baseLineAnaliticoSearchRepository.findByIdsistemaAndTipoOrderByNameAsc(id, "fd");
        List<BaselineAnaliticoDTO> baselineAnaliticoDTOS = new ArrayList<>();
        ModelMapper modelMapper = new ModelMapper();
        baseLineAnaliticos.forEach(baseLineAnalitico ->
            baselineAnaliticoDTOS.add(modelMapper.map(baseLineAnalitico, BaselineAnaliticoDTO.class))
        );
        baselineAnaliticoDTOS.forEach(baselineAnaliticoDTO ->
            baselineAnaliticoDTO.setIdfuncionalidade(pesquisarFuncionalidadeFD(baselineAnaliticoDTO.getIdfuncaodados()))
        );
        return baselineAnaliticoDTOS;
    }


    public List<BaseLineAnalitico> getBaseLineAnaliticoFT(@PathVariable Long id) {
        log.debug("REST request to get FT BaseLineAnalitico : {}", id);
        return baseLineAnaliticoSearchRepository.findByIdsistemaAndTipoOrderByNameAsc(id, "ft");
    }

    @GetMapping("/baseline-analiticos/ft/{id}")
    @Timed
    public List<BaselineAnaliticoDTO> getBaseLineAnaliticoFTDTO(@PathVariable Long id) {
        log.debug("REST request to get FT BaseLineAnaliticoDTO : {}", id);
        List<BaseLineAnalitico> baseLineAnaliticos = baseLineAnaliticoSearchRepository.findByIdsistemaAndTipoOrderByNameAsc(id, "ft");
        List<BaselineAnaliticoDTO> baselineAnaliticoDTOS = new ArrayList<>();

        ModelMapper modelMapper = new ModelMapper();

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
        List<BaseLineAnalitico> integerList = baseLineAnaliticoSearchRepository.findByIdsistemaAndTipoOrderByNameAsc(id, "fd");
        List<FuncaoDados> fds = new ArrayList<>();
        for (BaseLineAnalitico baseLineAnalitico : integerList) {
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
    public @ResponseBody
    byte[] downloadPdfBaselineBrowser(@PathVariable Long id) throws URISyntaxException, IOException, JRException {
        relatorioBaselineRest = new RelatorioBaselineRest(this.response, this.request);
        log.debug("REST request to generate report Analise baseline in browser : {}", recuperarBaselinePorSistema(id));
        return relatorioBaselineRest.downloadPdfBaselineBrowser(recuperarBaselinePorSistema(id), getBaseLineAnaliticoFD(id), getBaseLineAnaliticoFT(id));
    }

    @GetMapping("/baseline-analiticos/fd/{id}/equipe/{idEquipe}")
    @Timed
    public Page<BaseLineAnalitico> getBaseLineAnaliticoFDEquipe(@PathVariable String id,
                                                                @PathVariable String idEquipe,
                                                                @RequestParam(defaultValue = "ASC") String order,
                                                                @RequestParam(defaultValue = "0", name = PAGE) int pageNumber,
                                                                @RequestParam(defaultValue = "20") int size,
                                                                @RequestParam(defaultValue = "id") String sort) {
        log.debug(DBG_MSG_FD, id);
        Sort.Direction sortOrder = PageUtils.getSortDirection(order);
        Pageable pageable = new PageRequest(pageNumber, size, sortOrder, sort);
        BoolQueryBuilder qb = baselineAnaliseService.getBoolQueryBuilder(id, idEquipe, "fd");
        SearchQuery searchQuery = new NativeSearchQueryBuilder().withQuery(qb).withPageable(pageable).build();
        Page<BaseLineAnalitico> lstPage = elasticsearchTemplate.queryForPage(searchQuery, BaseLineAnalitico.class);
        return new PageImpl(lstPage.getContent(), pageable, lstPage.getTotalElements());
    }

    @GetMapping("/baseline-analiticos/ft/{id}/equipe/{idEquipe}")
    @Timed
    public Page<BaseLineAnalitico> getBaseLineAnaliticoFTEquipe(@PathVariable String id,
                                                                @PathVariable String idEquipe,
                                                                @RequestParam(defaultValue = "ASC") String order,
                                                                @RequestParam(defaultValue = "0", name = PAGE) int pageNumber,
                                                                @RequestParam(defaultValue = "20") int size,
                                                                @RequestParam(defaultValue = "id") String sort) {
        log.debug(DBG_MSG_FD, id);
        Sort.Direction sortOrder = PageUtils.getSortDirection(order);
        Pageable pageable = new PageRequest(pageNumber, size, sortOrder, sort);
        BoolQueryBuilder qb = baselineAnaliseService.getBoolQueryBuilder(id, idEquipe, "ft");
        SearchQuery searchQuery = new NativeSearchQueryBuilder().withQuery(qb).withPageable(pageable).build();
        Page<BaseLineAnalitico> lstPage = elasticsearchTemplate.queryForPage(searchQuery, BaseLineAnalitico.class);
        return new PageImpl(lstPage.getContent(), pageable, lstPage.getTotalElements());
    }
}
