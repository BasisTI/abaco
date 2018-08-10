package br.com.basis.abaco.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;

import br.com.basis.abaco.domain.Organizacao;
import br.com.basis.abaco.repository.OrganizacaoRepository;
import br.com.basis.abaco.repository.search.OrganizacaoSearchRepository;
import br.com.basis.abaco.utils.PageUtils;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import br.com.basis.abaco.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;

/**
 * REST controller for managing Organizacao.
 */
@RestController
@RequestMapping("/api")
public class OrganizacaoResource {

    private final Logger log = LoggerFactory.getLogger(OrganizacaoResource.class);

    private static final String ENTITY_NAME = "organizacao";

    private final OrganizacaoRepository organizacaoRepository;

    private final OrganizacaoSearchRepository organizacaoSearchRepository;

    private String erro, mensagem;

    public OrganizacaoResource(OrganizacaoRepository organizacaoRepository, OrganizacaoSearchRepository organizacaoSearchRepository) {
        this.organizacaoRepository = organizacaoRepository;
        this.organizacaoSearchRepository = organizacaoSearchRepository;
    }

    /**
     * Function to format a bad request URL to be returned to frontend
     * @param errorKey The key identifing the error occured
     * @param defaultMessage Default message to display to user
     * @return The bad request URL
     */
    private ResponseEntity<Organizacao> createBadRequest(String errorKey, String defaultMessage) {
        return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, errorKey, defaultMessage))
            .body(null);
    }

    public boolean validaCampo(String campo) {
        final String regra = "^\\S+(\\s{1}\\S+)*$";
        Pattern padrao = Pattern.compile(regra);
        Matcher matcherCampo = padrao.matcher(campo);
        return matcherCampo.find();
    }

    private boolean validaCamposOrganizacao(Organizacao org) {
        // Verificando validade de campos com relação à existência de espaços em branco no início ou no final e,opcionalmente, mais de um espaço entre palavras
        if (org.getNome() != null && !validaCampo(org.getNome())) {
            this.erro = "orgNomeInvalido";
            this.mensagem = "Nome de organização inválido";
            return false;
        }
        if (org.getCnpj() != null) {
            if (!validaCampo(org.getCnpj())){
                this.erro = "orgCnpjInvalido";
                this.mensagem = "CNPJ de organização inválido";
                return false;

            }
            /* Verifing if there is an existing Organizacao with same cnpj */
            Optional<Organizacao> existingOrganizacao = organizacaoRepository.findOneByCnpj(org.getCnpj());
            if (existingOrganizacao.isPresent()) {
                this.erro = "cnpjexists";
                this.mensagem = "CNPJ already in use";
                return false;
            }
        }
        if (org.getSigla() != null && !validaCampo(org.getSigla())) {
            this.erro = "orgSiglaInvalido";
            this.mensagem = "Sigla de organização inválido";
            return false;
        }
        if (org.getNumeroOcorrencia() != null && !validaCampo(org.getNumeroOcorrencia())) {
            this.erro = "orgNumOcorInvalido";
            this.mensagem = "Numero da Ocorrência de organização inválido";
            return false;
        }
        /* Verifing if there is an existing Organizacao with same name */
        Optional<Organizacao> existingOrganizacao = organizacaoRepository.findOneByNome(org.getNome());
        if (existingOrganizacao.isPresent() && (!existingOrganizacao.get().getId().equals(org.getId()))) {
            this.erro = "organizacaoexists";
            this.mensagem = "Organizacao already in use";
            return false;
        }
        return true;
    }

    /**
     * POST  /organizacaos : Create a new organizacao.
     *
     * @param organizacao the organizacao to create
     * @return the ResponseEntity with status 201 (Created) and with body the new organizacao, or with status 400 (Bad Request) if the organizacao has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/organizacaos")
    @Timed
    public ResponseEntity<Organizacao> createOrganizacao(@Valid @RequestBody Organizacao organizacao) throws URISyntaxException {
        log.debug("REST request to save Organizacao : {}", organizacao);
        if (organizacao.getId() != null) { return this.createBadRequest("idoexists", "A new organizacao cannot already have an ID"); }

        if (!validaCamposOrganizacao(organizacao)) {
            return this.createBadRequest(this.erro, this.mensagem);
        }

        Organizacao result = organizacaoRepository.save(organizacao);
        organizacaoSearchRepository.save(result);

        return ResponseEntity.created(new URI("/api/organizacaos/" + result.getId())).headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /organizacaos : Updates an existing organizacao.
     *
     * @param organizacao the organizacao to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated organizacao,
     * or with status 400 (Bad Request) if the organizacao is not valid,
     * or with status 500 (Internal Server Error) if the organizacao couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/organizacaos")
    @Timed
    public ResponseEntity<Organizacao> updateOrganizacao(@Valid @RequestBody Organizacao organizacao) throws URISyntaxException {
        log.debug("REST request to update Organizacao : {}", organizacao);
        if (organizacao.getId() == null) {
            return createOrganizacao(organizacao);
        }

        if (!validaCamposOrganizacao(organizacao)) {
            return this.createBadRequest(this.erro, this.mensagem);
        }

        Organizacao result = organizacaoRepository.save(organizacao);
        organizacaoSearchRepository.save(result);

        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, organizacao.getId().toString()))
            .body(result);
    }

    /**
     * GET  /organizacaos : get all the organizacaos.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of organizacaos in body
     */
    @GetMapping("/organizacaos")
    @Timed
    public List<Organizacao> getAllOrganizacaos() {
        log.debug("REST request to get all Organizacaos");
        List<Organizacao> organizacaos = organizacaoRepository.findAll();

        return organizacaos;
    }

    /**
     * GET  /organizacaos/:id : get the "id" organizacao.
     *
     * @param id the id of the organizacao to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the organizacao, or with status 404 (Not Found)
     */
    @GetMapping("/organizacaos/{id}")
    @Timed
    public ResponseEntity<Organizacao> getOrganizacao(@PathVariable Long id) {
        log.debug("REST request to get Organizacao : {}", id);
        Organizacao organizacao = organizacaoRepository.findOne(id);

        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(organizacao));
    }

    /**
     * DELETE  /organizacaos/:id : delete the "id" organizacao.
     *
     * @param id the id of the organizacao to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/organizacaos/{id}")
    @Timed
    public ResponseEntity<Void> deleteOrganizacao(@PathVariable Long id) {
        log.debug("REST request to delete Organizacao : {}", id);
        organizacaoRepository.delete(id);
        organizacaoSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/organizacaos?query=:query : search for the organizacao corresponding
     * to the query.
     *
     * @param query the query of the organizacao search
     * @return the result of the search
     * @throws URISyntaxException 
     */
    @GetMapping("/_search/organizacaos")
    @Timed
    public ResponseEntity<List<Organizacao>> searchOrganizacaos(@RequestParam(defaultValue = "*") String query, @RequestParam String order, @RequestParam(name="page") int pageNumber, @RequestParam int size, @RequestParam(defaultValue="id") String sort) throws URISyntaxException {
        log.debug("REST request to search Organizacaos for query {}", query);

        Sort.Direction sortOrder = PageUtils.getSortDirection(order);
        Pageable newPageable = new PageRequest(pageNumber, size, sortOrder, sort);
        
        Page<Organizacao> page = organizacaoSearchRepository.search(queryStringQuery(query), newPageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/organizacaos");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }


    @GetMapping("/organizacaos/active")
    public List<Organizacao> getAllOrganizationsActive() {
      List<Organizacao> activeOrganizations = this.organizacaoRepository.findByAtivoTrue();
      
      return activeOrganizations;
    }
}
