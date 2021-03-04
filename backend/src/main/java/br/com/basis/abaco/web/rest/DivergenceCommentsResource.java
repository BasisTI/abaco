package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.*;
import br.com.basis.abaco.repository.*;
import br.com.basis.abaco.security.SecurityUtils;
import br.com.basis.abaco.service.DivergenceCommentService;
import br.com.basis.abaco.service.dto.DivergenceCommentDTO;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import com.codahale.metrics.annotation.Timed;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    private final DivergenceCommentService divergenceCommentService;
    private final FuncaoDadosRepository funcaoDadosRepository;
    private final FuncaoTransacaoRepository funcaoTransacaoRepository;
    private final UserRepository userRepository;


    public DivergenceCommentsResource(  DivergenceCommentFuncaoDadosRepository divergenceCommentFuncaoDadosRepository,
                                        DivergenceCommentFuncaoTransacaoRepository divergenceCommentFuncaoTransacaoRepository,
                                        DivergenceCommentService divergenceCommentService,
                                        FuncaoDadosRepository funcaoDadosRepository,
                                        FuncaoTransacaoRepository funcaoTransacaoRepository,
                                        UserRepository userRepository){

        this.divergenceCommentFuncaoDadosRepository = divergenceCommentFuncaoDadosRepository;
        this.divergenceCommentFuncaoTransacaoRepository = divergenceCommentFuncaoTransacaoRepository;
        this.funcaoDadosRepository = funcaoDadosRepository;
        this.funcaoTransacaoRepository = funcaoTransacaoRepository;
        this.divergenceCommentService = divergenceCommentService;
        this.userRepository = userRepository;

    }

    @PostMapping("/comment/funcao-dados/{id}")
    @Timed
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
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).orElse(new User());
        if(user.getId() != null  && user.getId() > 0){
            divergenceCommentFuncaoDados.setUser(user);
        }
        DivergenceCommentDTO result = divergenceCommentService.saveCommentFuncaoDados(divergenceCommentFuncaoDados);
        return ResponseEntity.created(new URI("/api/funcao-dados/" + result.getId())).headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString())).body(result);
    }

    @PostMapping("/comment/funcao-transacao/{id}")
    @Timed
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
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).orElse(new User());
        if(user.getId() != null  && user.getId() > 0){
            divergenceCommentFuncaoTransacao.setUser(user);
        }
        DivergenceCommentDTO result = divergenceCommentService.saveFuncaoTransacao(divergenceCommentFuncaoTransacao);
        return ResponseEntity.created(new URI("/api/funcao-transacao/" + result.getId())).headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString())).body(result);
    }

    @PutMapping("/comment/funcao-dados/{id}")
    @Timed
    public ResponseEntity<DivergenceCommentDTO> updateDivergenceCommentFuncaoDados(@PathVariable Long id, @RequestBody String comment) throws URISyntaxException {
        log.debug("REST request to update DivergenceComment : {}", id);
        DivergenceCommentFuncaoDados divergenceCommentFuncaoDados = divergenceCommentFuncaoDadosRepository.findOne(id);
        if (divergenceCommentFuncaoDados.getId() == null) {
            return createDivergenceCommentFuncaoDados(divergenceCommentFuncaoDados.getFuncaoDados().getId(), divergenceCommentFuncaoDados.getComment());
        }
        divergenceCommentFuncaoDados.setComment(comment);
        DivergenceCommentDTO result = divergenceCommentService.saveCommentFuncaoDados(divergenceCommentFuncaoDados);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, divergenceCommentFuncaoDados.getId().toString())).body(result);
    }

    @PutMapping("/comment/funcao-transacao/{id}")
    @Timed
    public ResponseEntity<DivergenceCommentDTO> updateDivergenceCommentFuncaoTransacao(@PathVariable Long id, @RequestBody String comment) throws URISyntaxException {
        log.debug("REST request to update DivergenceComment : {}", id);
        DivergenceCommentFuncaoTransacao divergenceCommentFuncaoTransacao = divergenceCommentFuncaoTransacaoRepository.findOne(id);
        if (divergenceCommentFuncaoTransacao.getId() == null) {
            return createDivergenceCommentFuncaoTranscao(divergenceCommentFuncaoTransacao.getFuncaoTransacao().getId(), divergenceCommentFuncaoTransacao.getComment());
        }
        divergenceCommentFuncaoTransacao.setComment(comment);
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
    public ResponseEntity<Void> deleteDivergenceCommentFuncaoDados(@PathVariable Long id) {
        log.debug("REST request to delete DivergenceComment : {}", id);
        divergenceCommentFuncaoDadosRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @DeleteMapping("/comment/funcao-transacao/{id}")
    @Timed
    public ResponseEntity<Void> deleteDivergenceCommentFuncaoTrasacao(@PathVariable Long id) {
        log.debug("REST request to delete DivergenceComment : {}", id);
        divergenceCommentFuncaoTransacaoRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }


}
