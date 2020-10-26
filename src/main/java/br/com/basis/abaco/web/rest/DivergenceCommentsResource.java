package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.DivergenceComment;
import br.com.basis.abaco.domain.DivergenceCommentFuncaoDados;
import br.com.basis.abaco.domain.DivergenceCommentFuncaoTransacao;
import br.com.basis.abaco.domain.FuncaoDados;
import br.com.basis.abaco.domain.FuncaoTransacao;
import br.com.basis.abaco.repository.DivergenceCommentFuncaoDadosRepository;
import br.com.basis.abaco.repository.DivergenceCommentFuncaoTransacaoRepository;
import br.com.basis.abaco.repository.FuncaoDadosRepository;
import br.com.basis.abaco.repository.FuncaoTransacaoRepository;
import br.com.basis.abaco.repository.UserRepository;
import br.com.basis.abaco.repository.search.DivergenceCommentFuncaoDadosSearchRepository;
import br.com.basis.abaco.repository.search.DivergenceCommentFuncaoTransacaoSearchRepository;
import br.com.basis.abaco.security.AuthoritiesConstants;
import br.com.basis.abaco.security.SecurityUtils;
import br.com.basis.abaco.service.DivergenceCommentService;
import br.com.basis.abaco.service.dto.DivergenceCommentDTO;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import br.com.basis.dynamicexports.service.DynamicExportsService;
import com.codahale.metrics.annotation.Timed;
import io.github.jhipster.web.util.ResponseUtil;
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
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class DivergenceCommentsResource {

    private final Logger log = LoggerFactory.getLogger(DivergenceComment.class);
    private static final String ENTITY_NAME = "Comment";
    private final DivergenceCommentFuncaoDadosRepository divergenceCommentFuncaoDadosRepository;
    private final DivergenceCommentFuncaoTransacaoRepository divergenceCommentFuncaoTransacaoRepository;
    private final DivergenceCommentFuncaoDadosSearchRepository divergenceCommentFuncaoDadosSearchRepository;
    private final DivergenceCommentFuncaoTransacaoSearchRepository divergenceCommentFuncaoTransacaoSearchRepository;
    private final DivergenceCommentService divergenceCommentService;
    private final FuncaoDadosRepository funcaoDadosRepository;
    private final FuncaoTransacaoRepository funcaoTransacaoRepository;
    private final DynamicExportsService dynamicExportsService;
    private final UserRepository userRepository;


    public DivergenceCommentsResource(  DivergenceCommentFuncaoDadosRepository divergenceCommentFuncaoDadosRepository,
                                        DivergenceCommentFuncaoTransacaoRepository divergenceCommentFuncaoTransacaoRepository,
                                        DivergenceCommentFuncaoDadosSearchRepository divergenceCommentFuncaoDadosSearchRepository,
                                        DivergenceCommentFuncaoTransacaoSearchRepository divergenceCommentFuncaoTransacaoSearchRepository,
                                        DivergenceCommentService divergenceCommentService,
                                        FuncaoDadosRepository funcaoDadosRepository,
                                        FuncaoTransacaoRepository funcaoTransacaoRepository,
                                        UserRepository userRepository,
                                        DynamicExportsService dynamicExportsService){

        this.dynamicExportsService = dynamicExportsService;
        this.divergenceCommentFuncaoDadosRepository = divergenceCommentFuncaoDadosRepository;
        this.divergenceCommentFuncaoTransacaoRepository = divergenceCommentFuncaoTransacaoRepository;
        this.divergenceCommentFuncaoDadosSearchRepository = divergenceCommentFuncaoDadosSearchRepository;
        this.divergenceCommentFuncaoTransacaoSearchRepository = divergenceCommentFuncaoTransacaoSearchRepository;
        this.funcaoDadosRepository = funcaoDadosRepository;
        this.funcaoTransacaoRepository = funcaoTransacaoRepository;
        this.divergenceCommentService = divergenceCommentService;
        this.userRepository = userRepository;

    }

    @PostMapping("/comment/funcao-dados/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.GESTOR, AuthoritiesConstants.ANALISTA})
    public ResponseEntity<DivergenceCommentDTO> createDivergenceCommentFuncaoDados(@PathVariable Long id, @RequestBody String comment) throws URISyntaxException {
        log.debug("REST request to save DivergenceComment : {}", comment);
        FuncaoDados funcaoDados = funcaoDadosRepository.findById(id);
        if (funcaoDados.getId() != null && funcaoDados.getId() <= 0 ) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists",
                "A new DivergenceComment cannot already have an ID")).body(null);
        }
        DivergenceCommentFuncaoDados divergenceCommentFuncaoDados = new DivergenceCommentFuncaoDados();
        divergenceCommentFuncaoDados.setFuncaoDados(funcaoDados);
        divergenceCommentFuncaoDados.setComment(comment);
        divergenceCommentFuncaoDados.setUser(userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get());
        DivergenceCommentDTO result = divergenceCommentService.saveCommentFuncaoDados(divergenceCommentFuncaoDados);
        return ResponseEntity.created(new URI("/api/funcao-dados/" + result.getId())).headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString())).body(result);
    }

    @PostMapping("/comment/funcao-transacao/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.GESTOR, AuthoritiesConstants.ANALISTA})
    public ResponseEntity<DivergenceCommentDTO> createDivergenceCommentFuncaoTranscao(@PathVariable Long id, @RequestBody String comment) throws URISyntaxException {
        log.debug("REST request to save DivergenceComment : {}", comment);
        FuncaoTransacao funcaoTransacao = funcaoTransacaoRepository.findOne(id);
        if (funcaoTransacao.getId() != null && funcaoTransacao.getId() <= 0 ) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists",
                "A new DivergenceComment cannot already have an ID")).body(null);
        }
        DivergenceCommentFuncaoTransacao divergenceCommentFuncaoTransacao = new DivergenceCommentFuncaoTransacao();
        divergenceCommentFuncaoTransacao.setFuncaoTransacao(funcaoTransacao);
        divergenceCommentFuncaoTransacao.setComment(comment);
        divergenceCommentFuncaoTransacao.setUser(userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get());
        DivergenceCommentDTO result = divergenceCommentService.saveFuncaoTransacao(divergenceCommentFuncaoTransacao);
        return ResponseEntity.created(new URI("/api/funcao-transacao/" + result.getId())).headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString())).body(result);
    }

    @PutMapping("/comment/funcao-dados")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.GESTOR, AuthoritiesConstants.ANALISTA})
    public ResponseEntity<DivergenceCommentDTO> updateDivergenceCommentFuncaoDados(@Valid @RequestBody DivergenceCommentFuncaoDados divergenceCommentFuncaoDados)
        throws URISyntaxException {
        log.debug("REST request to update DivergenceComment : {}", divergenceCommentFuncaoDados);
        if (divergenceCommentFuncaoDados.getId() == null) {
            return createDivergenceCommentFuncaoDados(divergenceCommentFuncaoDados.getFuncaoDados().getId(), divergenceCommentFuncaoDados.getComment());
        }
        DivergenceCommentDTO result = divergenceCommentService.saveCommentFuncaoDados(divergenceCommentFuncaoDados);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, divergenceCommentFuncaoDados.getId().toString())).body(result);
    }

    @PutMapping("/comment/funcao-transacao")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.GESTOR, AuthoritiesConstants.ANALISTA})
    public ResponseEntity<DivergenceCommentDTO> updateDivergenceCommentFuncaoTransacao(@Valid @RequestBody DivergenceCommentFuncaoTransacao divergenceCommentFuncaoTransacao)
        throws URISyntaxException {
        log.debug("REST request to update DivergenceComment : {}", divergenceCommentFuncaoTransacao);
        if (divergenceCommentFuncaoTransacao.getId() == null) {
            return createDivergenceCommentFuncaoTranscao(divergenceCommentFuncaoTransacao.getFuncaoTransacao().getId(), divergenceCommentFuncaoTransacao.getComment());
        }
        DivergenceCommentDTO result = divergenceCommentService.saveFuncaoTransacao(divergenceCommentFuncaoTransacao);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, divergenceCommentFuncaoTransacao.getId().toString())).body(result);
    }

    @GetMapping("/comment/funcao-dados/{id}")
    @Timed
    public ResponseEntity<DivergenceComment> getDivergenceCommentFuncao(@PathVariable Long id) {
        log.debug("REST request to get DivergenceComment : {}", id);
        DivergenceComment nomenclatura = divergenceCommentFuncaoDadosRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(nomenclatura));
    }

    @GetMapping("/comment/funcao-transacao/{id}")
    @Timed
    public ResponseEntity<DivergenceComment> getDivergenceComment(@PathVariable Long id) {
        log.debug("REST request to get DivergenceComment : {}", id);
        DivergenceComment nomenclatura = divergenceCommentFuncaoTransacaoRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(nomenclatura));
    }

    @DeleteMapping("/comment/funcao-dados/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.GESTOR, AuthoritiesConstants.ANALISTA})
    public ResponseEntity<Void> deleteDivergenceCommentFuncaoDados(@PathVariable Long id) {
        log.debug("REST request to delete DivergenceComment : {}", id);
        divergenceCommentFuncaoDadosRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @DeleteMapping("/comment/funcao-transacao/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.GESTOR, AuthoritiesConstants.ANALISTA})
    public ResponseEntity<Void> deleteDivergenceCommentFuncaoTrasacao(@PathVariable Long id) {
        log.debug("REST request to delete DivergenceComment : {}", id);
        divergenceCommentFuncaoTransacaoRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }


}
