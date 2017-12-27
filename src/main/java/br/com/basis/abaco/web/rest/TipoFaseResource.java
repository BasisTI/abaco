package br.com.basis.abaco.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

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

import br.com.basis.abaco.domain.TipoFase;
import br.com.basis.abaco.repository.TipoFaseRepository;
import br.com.basis.abaco.repository.search.TipoFaseSearchRepository;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing TipoFase.
 */
@RestController
@RequestMapping("/api")
public class TipoFaseResource {

	private final Logger log = LoggerFactory.getLogger(TipoFaseResource.class);

	private static final String ENTITY_NAME = "tipoFase";

	private final TipoFaseRepository tipoFaseRepository;

	private final TipoFaseSearchRepository tipoFaseSearchRepository;

	public TipoFaseResource(TipoFaseRepository tipoFaseRepository, TipoFaseSearchRepository tipoFaseSearchRepository) {
		this.tipoFaseRepository = tipoFaseRepository;
		this.tipoFaseSearchRepository = tipoFaseSearchRepository;
	}

	/**
	 * POST /tipo-fases : Create a new tipoFase.
	 *
	 * @param tipoFase
	 *            the tipoFase to create
	 * @return the ResponseEntity with status 201 (Created) and with body the new
	 *         tipoFase, or with status 400 (Bad Request) if the tipoFase has
	 *         already an ID
	 * @throws URISyntaxException
	 *             if the Location URI syntax is incorrect
	 */
	@PostMapping("/tipo-fases")
	@Timed
	public ResponseEntity<TipoFase> createTipoFase(@RequestBody TipoFase tipoFase) throws URISyntaxException {
		log.debug("REST request to save TipoFase : {}", tipoFase);
		if (tipoFase.getId() != null) {
			return ResponseEntity.badRequest().headers(
					HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new tipoFase cannot already have an ID"))
					.body(null);
		}
		TipoFase result = tipoFaseRepository.save(tipoFase);
		tipoFaseSearchRepository.save(result);
		return ResponseEntity.created(new URI("/api/tipo-fases/" + result.getId()))
				.headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString())).body(result);
	}

	/**
	 * PUT /tipo-fases : Updates an existing tipoFase.
	 *
	 * @param tipoFase
	 *            the tipoFase to update
	 * @return the ResponseEntity with status 200 (OK) and with body the updated
	 *         tipoFase, or with status 400 (Bad Request) if the tipoFase is not
	 *         valid, or with status 500 (Internal Server Error) if the tipoFase
	 *         couldn't be updated
	 * @throws URISyntaxException
	 *             if the Location URI syntax is incorrect
	 */
	@PutMapping("/tipo-fases")
	@Timed
	public ResponseEntity<TipoFase> updateTipoFase(@RequestBody TipoFase tipoFase) throws URISyntaxException {
		log.debug("REST request to update TipoFase : {}", tipoFase);
		if (tipoFase.getId() == null) {
			return createTipoFase(tipoFase);
		}
		TipoFase result = tipoFaseRepository.save(tipoFase);
		tipoFaseSearchRepository.save(result);
		return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, tipoFase.getId().toString()))
				.body(result);
	}

	/**
	 * GET /tipo-fases : get all the tipoFases.
	 *
	 * @param pageable
	 *            the pagination information
	 * @return the ResponseEntity with status 200 (OK) and the list of tipoFases in
	 *         body
	 */
	@GetMapping("/tipo-fases")
	@Timed
	public List<TipoFase> getAllTipoFases() {
		log.debug("REST request to get a page of TipoFases");
		List<TipoFase> tipoFases = tipoFaseRepository.findAll();
		return tipoFases;
	}

	/**
	 * GET /tipo-fases/:id : get the "id" tipoFase.
	 *
	 * @param id
	 *            the id of the tipoFase to retrieve
	 * @return the ResponseEntity with status 200 (OK) and with body the tipoFase,
	 *         or with status 404 (Not Found)
	 */
	@GetMapping("/tipo-fases/{id}")
	@Timed
	public ResponseEntity<TipoFase> getTipoFase(@PathVariable Long id) {
		log.debug("REST request to get TipoFase : {}", id);
		TipoFase tipoFase = tipoFaseRepository.findOne(id);
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(tipoFase));
	}

	/**
	 * DELETE /tipo-fases/:id : delete the "id" tipoFase.
	 *
	 * @param id
	 *            the id of the tipoFase to delete
	 * @return the ResponseEntity with status 200 (OK)
	 */
	@DeleteMapping("/tipo-fases/{id}")
	@Timed
	public ResponseEntity<Void> deleteTipoFase(@PathVariable Long id) {
		log.debug("REST request to delete TipoFase : {}", id);
		tipoFaseRepository.delete(id);
		tipoFaseSearchRepository.delete(id);
		return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
	}

	/**
	 * SEARCH /_search/tipo-fases?query=:query : search for the tipoFase
	 * corresponding to the query.
	 *
	 * @param query
	 *            the query of the tipoFase search
	 * @param pageable
	 *            the pagination information
	 * @return the result of the search
	 */
	@GetMapping("/_search/tipo-fases")
	@Timed
	public List<TipoFase> searchTipoFases(@RequestParam String query, Pageable pageable) {
		log.debug("REST request to search for a page of TipoFases for query {}", query);
		return StreamSupport.stream(tipoFaseSearchRepository.search(queryStringQuery(query)).spliterator(), false)
				.collect(Collectors.toList());
	}

}
