package br.com.basis.abaco.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import javax.transaction.Transactional;
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

import br.com.basis.abaco.domain.Modulo;
import br.com.basis.abaco.domain.Organizacao;
import br.com.basis.abaco.domain.Sistema;
import br.com.basis.abaco.repository.OrganizacaoRepository;
import br.com.basis.abaco.repository.SistemaRepository;
import br.com.basis.abaco.repository.search.SistemaSearchRepository;
import br.com.basis.abaco.utils.PageUtils;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import br.com.basis.abaco.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;

/**
 * REST controller for managing Sistema.
 */
@RestController
@RequestMapping("/api")
public class SistemaResource {

	private final Logger log = LoggerFactory.getLogger(SistemaResource.class);

	private static final String ENTITY_NAME = "sistema";

	private final SistemaRepository sistemaRepository;

	private final SistemaSearchRepository sistemaSearchRepository;

	private final OrganizacaoRepository organizacaoRepository;

	public SistemaResource(SistemaRepository sistemaRepository, SistemaSearchRepository sistemaSearchRepository,
			OrganizacaoRepository organizacaoRepository) {
		this.sistemaRepository = sistemaRepository;
		this.sistemaSearchRepository = sistemaSearchRepository;
		this.organizacaoRepository = organizacaoRepository;
	}

	/**
	 * POST /sistemas : Create a new sistema.
	 *
	 * @param sistema
	 *            the sistema to create
	 * @return the ResponseEntity with status 201 (Created) and with body the new
	 *         sistema, or with status 400 (Bad Request) if the sistema has already
	 *         an ID
	 * @throws URISyntaxException
	 *             if the Location URI syntax is incorrect
	 */
	@PostMapping("/sistemas")
	@Timed
	public ResponseEntity<Sistema> createSistema(@Valid @RequestBody Sistema sistema) throws URISyntaxException {
		log.debug("REST request to save Sistema : {}", sistema);
		if (sistema.getId() != null) {
			return ResponseEntity.badRequest().headers(
					HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new sistema cannot already have an ID"))
					.body(null);
		}
		Sistema linkedSistema = linkSistemaToModuleToFunctionalities(sistema);
		Sistema result = sistemaRepository.save(linkedSistema);
		sistemaSearchRepository.save(result);
		return ResponseEntity.created(new URI("/api/sistemas/" + result.getId()))
				.headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString())).body(result);
	}

	private Sistema linkSistemaToModuleToFunctionalities(Sistema sistema) {
		Sistema linkedSistema = copySistema(sistema);
		Set<Modulo> modulos = linkedSistema.getModulos();
		modulos.forEach(m -> {
			m.setSistema(linkedSistema);
			m.getFuncionalidades().parallelStream().forEach(f -> f.setModulo(m));
		});
		return linkedSistema;
	}

	private Sistema copySistema(Sistema sistema) {
		Sistema copy = new Sistema();
		copy.setId(sistema.getId());
		copy.setSigla(sistema.getSigla());
		copy.setNome(sistema.getNome());
		copy.setNumeroOcorrencia(sistema.getNumeroOcorrencia());
		copy.setOrganizacao(sistema.getOrganizacao());
		copy.setModulos(new HashSet<>(sistema.getModulos()));
		return copy;
	}

	/**
	 * PUT /sistemas : Updates an existing sistema.
	 *
	 * @param sistema
	 *            the sistema to update
	 * @return the ResponseEntity with status 200 (OK) and with body the updated
	 *         sistema, or with status 400 (Bad Request) if the sistema is not
	 *         valid, or with status 500 (Internal Server Error) if the sistema
	 *         couldnt be updated
	 * @throws URISyntaxException
	 *             if the Location URI syntax is incorrect
	 */
	@PutMapping("/sistemas")
	@Timed
	public ResponseEntity<Sistema> updateSistema(@Valid @RequestBody Sistema sistema) throws URISyntaxException {
		log.debug("REST request to update Sistema : {}", sistema);
		if (sistema.getId() == null) {
			return createSistema(sistema);
		}
		Sistema linkedSistema = linkSistemaToModuleToFunctionalities(sistema);
		Sistema result = sistemaRepository.save(linkedSistema);
		sistemaSearchRepository.save(result);
		return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, sistema.getId().toString()))
				.body(result);
	}

	/**
	 * GET /sistemas : get all the sistemas.
	 *
	 * @return the ResponseEntity with status 200 (OK) and the list of sistemas in
	 *         body
	 */
	@PostMapping("/sistemas/organizations")
	@Timed
	public List<Sistema> getAllSistemasByOrganization(@Valid @RequestBody Organizacao organization) {
		log.debug("REST request to get all Sistemas");
		List<Sistema> sistemas = sistemaRepository.findAllByOrganizacao(organization);
		return sistemas;
	}

	@GetMapping("/sistemas/organizacao/{idOrganizacao}")
	@Timed
	@Transactional
	public Set<Sistema> getAllSistemasByOrganizacaoId(@PathVariable Long idOrganizacao) {
		Organizacao organizacao = organizacaoRepository.findOne(idOrganizacao);
		return organizacao.getSistemas();
	}

	/**
	 * GET /sistemas : get all the sistemas.
	 *
	 * @return the ResponseEntity with status 200 (OK) and the list of sistemas in
	 *         body
	 */
	@GetMapping("/sistemas")
	@Timed
	public List<Sistema> getAllSistemas() {
		log.debug("REST request to get all Sistemas");
		List<Sistema> sistemas = sistemaRepository.findAll();
		return sistemas;
	}

	/**
	 * GET /sistemas/:id : get the "id" sistema.
	 *
	 * @param id
	 *            the id of the sistema to retrieve
	 * @return the ResponseEntity with status 200 (OK) and with body the sistema, or
	 *         with status 404 (Not Found)
	 */
	@GetMapping("/sistemas/{id}")
	@Timed
	public ResponseEntity<Sistema> getSistema(@PathVariable Long id) {
		log.debug("REST request to get Sistema : {}", id);
		Sistema sistema = sistemaRepository.findOne(id);
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(sistema));
	}

	/**
	 * DELETE /sistemas/:id : delete the "id" sistema.
	 *
	 * @param id
	 *            the id of the sistema to delete
	 * @return the ResponseEntity with status 200 (OK)
	 */
	@DeleteMapping("/sistemas/{id}")
	@Timed
	public ResponseEntity<Void> deleteSistema(@PathVariable Long id) {
		log.debug("REST request to delete Sistema : {}", id);
		sistemaRepository.delete(id);
		sistemaSearchRepository.delete(id);
		return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
	}

	/**
	 * SEARCH /_search/sistemas?query=:query : search for the sistema corresponding
	 * to the query.
	 *
	 * @param query
	 *            the query of the sistema search
	 * @return the result of the search
	 * @throws URISyntaxException 
	 */
	@GetMapping("/_search/sistemas")
	@Timed
	public ResponseEntity<List<Sistema>> searchSistemas(@RequestParam(defaultValue = "*") String query, @RequestParam String order, @RequestParam(name="page") int pageNumber, @RequestParam int size, @RequestParam(defaultValue="id") String sort) throws URISyntaxException {
		log.debug("REST request to search Sistemas for query {}", query);
		Sort.Direction sortOrder = PageUtils.getSortDirection(order);
        Pageable newPageable = new PageRequest(pageNumber, size, sortOrder, sort);
		
		Page<Sistema> page = sistemaSearchRepository.search(queryStringQuery(query), newPageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/sistemas");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
	}

}
