package br.com.basis.abaco.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
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

import br.com.basis.abaco.domain.TipoEquipe;
import br.com.basis.abaco.repository.TipoEquipeRepository;
import br.com.basis.abaco.repository.search.TipoEquipeSearchRepository;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing TipoEquipe.
 */
@RestController
@RequestMapping("/api")
public class TipoEquipeResource {

	private final Logger log = LoggerFactory.getLogger(TipoEquipeResource.class);

	private static final String ENTITY_NAME = "tipoEquipe";

	private final TipoEquipeRepository tipoEquipeRepository;

	private final TipoEquipeSearchRepository tipoEquipeSearchRepository;

	public TipoEquipeResource(TipoEquipeRepository tipoEquipeRepository,
			TipoEquipeSearchRepository tipoEquipeSearchRepository) {
		this.tipoEquipeRepository = tipoEquipeRepository;
		this.tipoEquipeSearchRepository = tipoEquipeSearchRepository;
	}

	/**
	 * POST /tipo-equipes : Create a new tipoEquipe.
	 *
	 * @param tipoEquipe
	 *            the tipoEquipe to create
	 * @return the ResponseEntity with status 201 (Created) and with body the new
	 *         tipoEquipe, or with status 400 (Bad Request) if the tipoEquipe has
	 *         already an ID
	 * @throws URISyntaxException
	 *             if the Location URI syntax is incorrect
	 */
	@PostMapping("/tipo-equipes")
	@Timed
	public ResponseEntity<TipoEquipe> createTipoEquipe(@Valid @RequestBody TipoEquipe tipoEquipe)
			throws URISyntaxException {
		log.debug("REST request to save TipoEquipe : {}", tipoEquipe);
		if (tipoEquipe.getId() != null) {
			return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists",
					"A new TipoEquipe cannot already have an ID")).body(null);
		}
		TipoEquipe result = tipoEquipeRepository.save(tipoEquipe);
		tipoEquipeSearchRepository.save(result);
		return ResponseEntity.created(new URI("/api/tipo-equipes/" + result.getId()))
				.headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString())).body(result);
	}

	/**
	 * PUT /tipo-equipes : Updates an existing tipoEquipe.
	 *
	 * @param tipoEquipe
	 *            the tipoEquipe to update
	 * @return the ResponseEntity with status 200 (OK) and with body the updated
	 *         tipoEquipe, or with status 400 (Bad Request) if the tipoEquipe is not
	 *         valid, or with status 500 (Internal Server Error) if the tipoEquipe
	 *         couldn't be updated
	 * @throws URISyntaxException
	 *             if the Location URI syntax is incorrect
	 */
	@PutMapping("/tipo-equipes")
	@Timed
	public ResponseEntity<TipoEquipe> updateTipoEquipe(@Valid @RequestBody TipoEquipe tipoEquipe)
			throws URISyntaxException {
		log.debug("REST request to update TipoEquipe : {}", tipoEquipe);
		if (tipoEquipe.getId() == null) {
			return createTipoEquipe(tipoEquipe);
		}
		TipoEquipe result = tipoEquipeRepository.save(tipoEquipe);
		tipoEquipeSearchRepository.save(result);
		return ResponseEntity.ok()
				.headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, tipoEquipe.getId().toString())).body(result);
	}

	/**
	 * GET /tipo-equipes : get all the tipoEquipes.
	 *
	 * @param pageable
	 *            the pagination information
	 * @return the ResponseEntity with status 200 (OK) and the list of tipoEquipes
	 *         in body
	 */
	@GetMapping("/tipo-equipes")
	@Timed
	public List<TipoEquipe> getAllTipoEquipes() {
		log.debug("REST request to get a page of TipoEquipes");
		List<TipoEquipe> tipoEquipes = tipoEquipeRepository.findAll();
		return tipoEquipes;
	}

	/**
	 * GET /tipo-equipes/:id : get the "id" tipoEquipe.
	 *
	 * @param id
	 *            the id of the tipoEquipe to retrieve
	 * @return the ResponseEntity with status 200 (OK) and with body the tipoEquipe,
	 *         or with status 404 (Not Found)
	 */
	@GetMapping("/tipo-equipes/{id}")
	@Timed
	public ResponseEntity<TipoEquipe> getTipoEquipe(@PathVariable Long id) {
		log.debug("REST request to get TipoEquipe : {}", id);
		TipoEquipe tipoEquipe = tipoEquipeRepository.findOne(id);
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(tipoEquipe));
	}

	/**
	 * DELETE /tipo-equipes/:id : delete the "id" tipoEquipe.
	 *
	 * @param id
	 *            the id of the tipoEquipe to delete
	 * @return the ResponseEntity with status 200 (OK)
	 */
	@DeleteMapping("/tipo-equipes/{id}")
	@Timed
	public ResponseEntity<Void> deleteTipoEquipe(@PathVariable Long id) {
		log.debug("REST request to delete TipoEquipe : {}", id);
		tipoEquipeRepository.delete(id);
		tipoEquipeSearchRepository.delete(id);
		return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
	}

	/**
	 * SEARCH /_search/tipo-equipes?query=:query : search for the tipoEquipe
	 * corresponding to the query.
	 *
	 * @param query
	 *            the query of the tipoEquipe search
	 * @param pageable
	 *            the pagination information
	 * @return the result of the search
	 */
	@GetMapping("/_search/tipo-equipes")
	@Timed
	public List<TipoEquipe> searchTipoEquipes(@RequestParam(defaultValue = "*") String query, Pageable pageable) {
		log.debug("REST request to search for a page of TipoEquipes for query {}", query);
		return StreamSupport
	            .stream(tipoEquipeSearchRepository.search(queryStringQuery(query)).spliterator(), false)
	            .collect(Collectors.toList());
	}

}
