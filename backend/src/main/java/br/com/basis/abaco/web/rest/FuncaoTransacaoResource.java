package br.com.basis.abaco.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.lang.reflect.InvocationTargetException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import br.com.basis.abaco.service.FuncaoDadosService;
import br.com.basis.abaco.service.dto.FuncaoTransacaoSaveDTO;
import org.jetbrains.annotations.NotNull;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.codahale.metrics.annotation.Timed;

import br.com.basis.abaco.domain.Alr;
import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.domain.Der;
import br.com.basis.abaco.domain.FuncaoTransacao;
import br.com.basis.abaco.domain.UploadedFile;
import br.com.basis.abaco.domain.VwAlr;
import br.com.basis.abaco.domain.VwDer;
import br.com.basis.abaco.domain.enumeration.StatusFuncao;
import br.com.basis.abaco.repository.AnaliseRepository;
import br.com.basis.abaco.repository.DerRepository;
import br.com.basis.abaco.repository.FuncaoTransacaoRepository;
import br.com.basis.abaco.repository.UploadedFilesRepository;
import br.com.basis.abaco.repository.search.FuncaoTransacaoSearchRepository;
import br.com.basis.abaco.repository.search.VwAlrSearchRepository;
import br.com.basis.abaco.repository.search.VwDerSearchRepository;
import br.com.basis.abaco.service.FuncaoTransacaoService;
import br.com.basis.abaco.service.dto.FuncaoTransacaoAnaliseDTO;
import br.com.basis.abaco.service.dto.FuncaoTransacaoApiDTO;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing FuncaoTransacao.
 */
@RestController
@RequestMapping("/api")
public class FuncaoTransacaoResource {
    private final Logger log = LoggerFactory.getLogger(FuncaoTransacaoResource.class);
    private static final String ENTITY_NAME = "funcaoTransacao";
    private final FuncaoTransacaoRepository funcaoTransacaoRepository;
    private final FuncaoTransacaoSearchRepository funcaoTransacaoSearchRepository;
    private final AnaliseRepository analiseRepository;
    private final VwDerSearchRepository vwDerSearchRepository;
    private final VwAlrSearchRepository vwAlrSearchRepository;
    private final FuncaoDadosService funcaoDadosService;
    @Autowired
    private DerRepository derRepository;
    @Autowired
    private ModelMapper modelMapper;

    public FuncaoTransacaoResource(FuncaoTransacaoRepository funcaoTransacaoRepository, FuncaoTransacaoSearchRepository funcaoTransacaoSearchRepository, AnaliseRepository analiseRepository, VwDerSearchRepository vwDerSearchRepository, VwAlrSearchRepository vwAlrSearchRepository, FuncaoDadosService funcaoDadosService) {
        this.funcaoTransacaoRepository = funcaoTransacaoRepository;
        this.funcaoTransacaoSearchRepository = funcaoTransacaoSearchRepository;
        this.analiseRepository = analiseRepository;
        this.vwDerSearchRepository = vwDerSearchRepository;
        this.vwAlrSearchRepository = vwAlrSearchRepository;
        this.funcaoDadosService = funcaoDadosService;
    }

    /**
     * POST  /funcao-transacaos : Create a new funcaoTransacao.
     *
     * @param funcaoTransacao the funcaoTransacao to create
     * @return the ResponseEntity with status 201 (Created) and with body the new funcaoTransacao, or with status 400 (Bad Request) if the funcaoTransacao has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping(path = "/funcao-transacaos/{idAnalise}", consumes = {"multipart/form-data"})
    @Timed
    public ResponseEntity<FuncaoTransacao> createFuncaoTransacao(@PathVariable Long idAnalise, @RequestPart("funcaoTransacao") FuncaoTransacao funcaoTransacao, @RequestPart("files")List<MultipartFile> files) throws URISyntaxException {
        log.debug("REST request to save FuncaoTransacao : {}", funcaoTransacao);
        Analise analise = analiseRepository.findOne(idAnalise);
        funcaoTransacao.getDers().forEach(alr -> {alr.setFuncaoTransacao(funcaoTransacao);});
        funcaoTransacao.getAlrs().forEach((der -> {der.setFuncaoTransacao(funcaoTransacao);}));
        funcaoTransacao.setAnalise(analise);
        if (funcaoTransacao.getId() != null || analise.getId() == null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new funcaoTransacao cannot already have an ID")).body(null);
        }

        if(!files.isEmpty()){
            List<UploadedFile> uploadedFiles = funcaoDadosService.uploadFiles(files);
            funcaoTransacao.setFiles(uploadedFiles);
        }

        funcaoTransacao.setDers(bindDers(funcaoTransacao));

        FuncaoTransacao result = funcaoTransacaoRepository.save(funcaoTransacao);

        saveVwDersAndVwAlrs(result.getDers(), result.getAlrs(), analise.getSistema().getId());

        return ResponseEntity.created(new URI("/api/funcao-transacaos/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
                .body(result);
    }

    /**
     * PUT  /funcao-transacaos : Updates an existing funcaoTransacao.
     *
     * @param funcaoTransacao the funcaoTransacao to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated funcaoTransacao,
     * or with status 400 (Bad Request) if the funcaoTransacao is not valid,
     * or with status 500 (Internal Server Error) if the funcaoTransacao couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping(path = "/funcao-transacaos/{id}", consumes = {"multipart/form-data"})
    @Timed
    public ResponseEntity<FuncaoTransacao> updateFuncaoTransacao(@PathVariable Long id, @RequestPart("funcaoTransacao") FuncaoTransacaoSaveDTO funcaoTransacaoDTO, @RequestPart("files")List<MultipartFile> files) throws URISyntaxException, InvocationTargetException, IllegalAccessException {
        FuncaoTransacao funcaoTransacao = funcaoTransacaoDTO.toEntity();

        log.debug("REST request to update FuncaoTransacao : {}", funcaoTransacao);
        FuncaoTransacao funcaoTransacaoOld = funcaoTransacaoRepository.findOne(id);
        Analise analise = analiseRepository.findOne(funcaoTransacaoOld.getAnalise().getId());
        funcaoTransacao.getDers().forEach(alr -> {alr.setFuncaoTransacao(funcaoTransacao);});
        funcaoTransacao.getAlrs().forEach((der -> {der.setFuncaoTransacao(funcaoTransacao);}));
        funcaoTransacao.setAnalise(analise);

        if (funcaoTransacao.getId() == null) {
            return createFuncaoTransacao(analise.getId(), funcaoTransacao, files);
        }

        if (funcaoTransacao.getAnalise() == null || funcaoTransacao.getAnalise().getId() == null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new funcaoTransacao cannot already have an ID")).body(null);
        }
        if(!files.isEmpty()){
            List<UploadedFile> uploadedFiles = funcaoDadosService.uploadFiles(files);
            funcaoTransacao.setFiles(uploadedFiles);
        }

        FuncaoTransacao result = funcaoTransacaoRepository.save(funcaoTransacao);

        saveVwDersAndVwAlrs(result.getDers(), result.getAlrs(), analise.getSistema().getId());

        return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, funcaoTransacao.getId().toString())).body(result);
    }

    /**
     * GET  /funcao-transacaos : get all the funcaoTransacaos.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of funcaoTransacaos in body
     */
    @GetMapping("/funcao-transacaos")
    @Timed
    public List<FuncaoTransacao> getAllFuncaoTransacaos() {
        log.debug("REST request to get all FuncaoTransacaos");
        List<FuncaoTransacao> funcaoTransacaos = funcaoTransacaoRepository.findAll();
        funcaoTransacaos.stream().filter(f -> f.getAnalise() != null).forEach(f -> {
            if (f.getAnalise().getFuncaoDados() != null) {
                f.getAnalise().getFuncaoDados().clear();
            }
            if (f.getAnalise().getFuncaoTransacaos() != null) {
                f.getAnalise().getFuncaoTransacaos().clear();
            }
        });
        return funcaoTransacaos;
    }

    /**
     * GET  /funcao-transacaos/:id : get the "id" funcaoTransacao.
     *
     * @param id the id of the funcaoTransacao to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the funcaoTransacao, or with status 404 (Not Found)
     */
    @GetMapping("/funcao-transacaos/{id}")
    @Timed
    public ResponseEntity<FuncaoTransacaoApiDTO> getFuncaoTransacao(@PathVariable Long id) {
        log.debug("REST request to get FuncaoTransacao : {}", id);
        FuncaoTransacao funcaoTransacao = funcaoTransacaoRepository.findOne(id);
        FuncaoTransacaoApiDTO funcaoDadosDTO = modelMapper.map(funcaoTransacao, FuncaoTransacaoApiDTO.class);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(funcaoDadosDTO));
    }

    @GetMapping("/funcao-transacaos-dto/analise/{id}")
    @Timed
    public ResponseEntity<List<FuncaoTransacaoAnaliseDTO>> getFuncaoTransacaoByAnalise(@PathVariable Long id) {
        Set<FuncaoTransacao> lstFuncadoTransacao = funcaoTransacaoRepository.findAllByAnaliseId(id);
        List<FuncaoTransacaoAnaliseDTO> lstFuncaoDadosDTO = lstFuncadoTransacao.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(lstFuncaoDadosDTO));
    }

    /**
     * GET  /funcao-transacaos/completa/:id : get the "id" funcaotransacao.
     *
     * @param id the id of the funcaoTransacao to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the funcaoTransacao, or with status 404 (Not Found)
     */
    @GetMapping("/funcao-transacaos/completa/{id}")
    @Timed
    public ResponseEntity<FuncaoTransacaoApiDTO> getFuncaoTransacaoCompleta(@PathVariable Long id) {
        log.debug("REST request to get FuncaoTransacao Completa : {}", id);
        FuncaoTransacao funcaoTransacao = funcaoTransacaoRepository.findWithDerAndAlr(id);
        FuncaoTransacaoApiDTO funcaoDadosDTO = modelMapper.map(funcaoTransacao, FuncaoTransacaoApiDTO.class);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(funcaoDadosDTO));
    }

    /**
     * DELETE  /funcao-transacaos/:id : delete the "id" funcaoTransacao.
     *
     * @param id the id of the funcaoTransacao to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/funcao-transacaos/{id}")
    @Timed
    public ResponseEntity<Void> deleteFuncaoTransacao(@PathVariable Long id) {
        log.debug("REST request to delete FuncaoTransacao : {}", id);
        FuncaoTransacao funcaoTransacao = funcaoTransacaoRepository.findOne(id);
        funcaoTransacao.getDers().forEach(item -> vwDerSearchRepository.delete(item.getId()));
        funcaoTransacao.getAlrs().forEach(item -> vwAlrSearchRepository.delete(item.getId()));
        funcaoTransacaoRepository.delete(id);
        funcaoTransacaoSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/funcao-transacaos?query=:query : search for the funcaoTransacao corresponding
     * to the query.
     *
     * @param query the query of the funcaoTransacao search
     * @return the result of the search
     */
    @GetMapping("/_search/funcao-transacaos")
    @Timed
    public List<FuncaoTransacao> searchFuncaoTransacaos(@RequestParam(defaultValue = "*") String query) {
        log.debug("REST request to search FuncaoTransacaos for query {}", query);
        return StreamSupport
                .stream(funcaoTransacaoSearchRepository.search(queryStringQuery(query)).spliterator(), false)
                .collect(Collectors.toList());
    }

    @GetMapping("/funcao-transacaos/{idAnalise}/{idfuncionalidade}/{idModulo}")
    @Timed
    public ResponseEntity<Boolean> existFuncaoDados(@PathVariable Long idAnalise, @PathVariable Long idfuncionalidade, @PathVariable Long idModulo, @RequestParam String name, @RequestParam(required = false) Long id) {
        log.debug("REST request to exist FuncaoDados");
        Boolean existInAnalise;
        if (id != null && id > 0) {

            existInAnalise = funcaoTransacaoRepository.existsByNameAndAnaliseIdAndFuncionalidadeIdAndFuncionalidadeModuloIdAndIdNot(name, idAnalise, idfuncionalidade, idModulo, id);
        } else {
            existInAnalise = funcaoTransacaoRepository.existsByNameAndAnaliseIdAndFuncionalidadeIdAndFuncionalidadeModuloId(name, idAnalise, idfuncionalidade, idModulo);
        }
        return ResponseEntity.ok(existInAnalise);
    }

    /**
     * GET  /funcao-transacaos/:id : get the "id" funcaoTransacao.
     *
     * @param id the id of the funcaoTransacao to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the funcaoTransacao, or with status 404 (Not Found)
     */
    @GetMapping("/funcao-transacaos/update-status/{id}/{statusFuncao}")
    @Timed
    public ResponseEntity<FuncaoTransacaoApiDTO> updateFuncaoTransacao(@PathVariable Long id, @PathVariable StatusFuncao statusFuncao) {
        log.debug("REST request to get FuncaoTransacao by Status : {}", id);
        FuncaoTransacao funcaoTransacao = funcaoTransacaoRepository.findOne(id);
        funcaoTransacao.setStatusFuncao(statusFuncao);
        funcaoTransacaoRepository.save(funcaoTransacao);
        FuncaoTransacaoApiDTO funcaoDadosDTO = modelMapper.map(funcaoTransacao, FuncaoTransacaoApiDTO.class);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(funcaoDadosDTO));
    }


    private FuncaoTransacaoAnaliseDTO convertToDto(FuncaoTransacao funcaoTransacao) {
        FuncaoTransacaoAnaliseDTO funcaoTransacaoAnaliseDTO = modelMapper.map(funcaoTransacao, FuncaoTransacaoAnaliseDTO.class);
        funcaoTransacaoAnaliseDTO.setFtrFilter(getValueFtr(funcaoTransacao));
        funcaoTransacaoAnaliseDTO.setDerFilter(getValueDer(funcaoTransacao));
        funcaoTransacaoAnaliseDTO.setHasSustantation(getSustantation(funcaoTransacao));
        return funcaoTransacaoAnaliseDTO;
    }


    private Integer getValueDer(FuncaoTransacao funcaoTransacao) {
        int dersValues = funcaoTransacao.getDers().size();
        if (dersValues == 1) {
            Der der = funcaoTransacao.getDers().iterator().next();
            if (der.getValor() != null) {
                dersValues = der.getValor();
            }
        }
        return dersValues;
    }

    private Integer getValueFtr(FuncaoTransacao funcaoTransacao) {
        int alrValues = funcaoTransacao.getAlrs().size();
        if (alrValues >= 1) {
            Alr alr = funcaoTransacao.getAlrs().iterator().next();
            if (alr.getValor() != null) {
                alrValues = alr.getValor();
            }
        }
        return alrValues;
    }

    private Boolean getSustantation(FuncaoTransacao funcaoTransacao) {
        return funcaoTransacao.getSustantation() != null && !(funcaoTransacao.getSustantation().isEmpty());
    }


    @NotNull
    private Set<Der> bindDers(@RequestBody FuncaoTransacao funcaoTransacao) {
        Set<Der> ders = new HashSet<>();
        funcaoTransacao.getDers().forEach(der -> {
            if (der.getId() != null) {
                der = derRepository.findOne(der.getId());
                der = new Der(null, der.getNome(), der.getValor(), der.getRlr(), null, funcaoTransacao);
                ders.add(der);
            } else {
                ders.add(der);
            }
        });
        return ders;
    }

    private void saveVwDersAndVwAlrs(Set<Der> ders, Set<Alr> alrs, Long idSistema) {
        List<VwDer> vwDerList = vwDerSearchRepository.findAllByIdSistemaFT(idSistema);
        List<VwAlr> vwAlrList = vwAlrSearchRepository.findAllByIdSistema(idSistema);

        saveVwDers(ders, vwDerList, idSistema);
        saveVwAlrs(alrs, vwAlrList, idSistema);
    }

    private void saveVwAlrs(Set<Alr> alrs, List<VwAlr> vwAlrList, Long idSistema) {
        List<VwAlr> vwAlrs = new ArrayList<>();
        if(!alrs.isEmpty()){
            alrs.forEach(item -> {
                VwAlr vwAlr = new VwAlr();
                if(item.getId() != null){
                    vwAlr.setId(item.getId());
                }
                vwAlr.setNome(item.getNome());
                vwAlr.setIdSistema(idSistema);
                if(!vwAlrList.contains(vwAlr)){
                    vwAlrs.add(vwAlr);
                }
            });
            if(!vwAlrs.isEmpty()){
                vwAlrSearchRepository.save(vwAlrs);
            }
        }
    }

    private void saveVwDers(Set<Der> ders, List<VwDer> vwDerList, Long idSistema) {
        List<VwDer> vwDers = new ArrayList<>();
        if(!ders.isEmpty()){
            ders.forEach(item -> {
                VwDer vwDer = new VwDer();
                if(item.getId() != null){
                    vwDer.setId(item.getId());
                }
                vwDer.setNome(item.getNome());
                vwDer.setIdSistemaFT(idSistema);
                if(!vwDerList.contains(vwDer)){
                    vwDers.add(vwDer);
                }
            });
            if(!vwDers.isEmpty()){
                vwDerSearchRepository.save(vwDers);
            }
        }
    }

}
