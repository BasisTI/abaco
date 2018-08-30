package br.com.basis.abaco.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.multiMatchQuery;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.io.ByteArrayOutputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import br.com.basis.abaco.repository.AnaliseRepository;
import br.com.basis.abaco.security.SecurityUtils;
import br.com.basis.abaco.service.exception.RelatorioException;
import br.com.basis.abaco.service.relatorio.RelatorioUserColunas;
import br.com.basis.abaco.service.util.RandomUtil;
import br.com.basis.abaco.utils.AbacoUtil;
import br.com.basis.dynamicexports.service.DynamicExportsService;
import br.com.basis.dynamicexports.util.DynamicExporter;
import net.sf.dynamicreports.report.exception.DRException;
import net.sf.jasperreports.engine.JRException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

import com.codahale.metrics.annotation.Timed;

import br.com.basis.abaco.domain.Authority;
import br.com.basis.abaco.domain.User;
import br.com.basis.abaco.repository.AuthorityRepository;
import br.com.basis.abaco.repository.UserRepository;
import br.com.basis.abaco.repository.search.UserSearchRepository;
import br.com.basis.abaco.security.AuthoritiesConstants;
import br.com.basis.abaco.service.MailService;
import br.com.basis.abaco.service.UserService;
import br.com.basis.abaco.service.dto.UserDTO;
import br.com.basis.abaco.utils.PageUtils;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import br.com.basis.abaco.web.rest.util.PaginationUtil;
import io.swagger.annotations.ApiParam;

/**
 * REST controller for managing users.
 * <p>
 * <p>
 * This class accesses the User entity, and needs to fetch its collection of
 * authorities.
 * </p>
 * <p>
 * For a normal use-case, it would be better to have an eager relationship
 * between User and Authority, and send everything to the client side: there
 * would be no View Model and DTO, a lot less code, and an outer-join which
 * would be good for performance.
 * </p>
 * <p>
 * We use a View Model and a DTO for 3 reasons:
 * <ul>
 * <li>We want to keep a lazy association between the user and the authorities,
 * because people will quite often do relationships with the user, and we don't
 * want them to get the authorities all the time for nothing (for performance
 * reasons). This is the #1 goal: we should not impact our users' application
 * because of this use-case.</li>
 * <li>Not having an outer join causes n+1 requests to the database. This is not
 * a real issue as we have by default a second-level cache. This means on the
 * first HTTP call we do the n+1 requests, but then all authorities come from
 * the cache, so in fact it's much better than doing an outer join (which will
 * get lots of data from the database, for each HTTP call).</li>
 * <li>As this manages users, for security reasons, we'd rather have a DTO
 * layer.</li>
 * </ul>
 * <p>
 * Another option would be to have a specific JPA entity graph to handle this
 * case.
 * </p>
 */
@RestController
@RequestMapping("/api")
public class UserResource {

	private final Logger log = LoggerFactory.getLogger(UserResource.class);

	private static final String ENTITY_NAME = "userManagement";

	private final UserRepository userRepository;

    private final AnaliseRepository analiseRepository;

	private final MailService mailService;

	private final UserService userService;

	private final UserSearchRepository userSearchRepository;

	private final AuthorityRepository authorityRepository;

    private final DynamicExportsService dynamicExportsService;

    private String userexists = "userexists";

    public UserResource(UserRepository userRepository, MailService mailService, UserService userService,
			UserSearchRepository userSearchRepository, AuthorityRepository authorityRepository, DynamicExportsService dynamicExportsService, AnaliseRepository analiseRepository) {

        this.analiseRepository = analiseRepository;
		this.userRepository = userRepository;
		this.mailService = mailService;
		this.userService = userService;
		this.userSearchRepository = userSearchRepository;
		this.authorityRepository = authorityRepository;
        this.dynamicExportsService = dynamicExportsService;

    }

	/**
	 * POST /users : Creates a new user.
	 * <p>
	 * Creates a new user if the login and email are not already used, and sends an
	 * mail with an activation link. The user needs to be activated on creation.
	 * </p>
	 *
	 * @param user the user to create
	 * @return the ResponseEntity with status 201 (Created) and with body the new
	 *         user, or with status 400 (Bad Request) if the login or email is
	 *         already in use
	 * @throws URISyntaxException if the Location URI syntax is incorrect
	 */
	@PostMapping("/users")
	@Timed
	@Secured(AuthoritiesConstants.ADMIN)
	public ResponseEntity createUser(@RequestBody User user) throws URISyntaxException {
		log.debug("REST request to save User : {}", user);

		// Lowercase the user login before comparing with database
		if (userRepository.findOneByLogin(user.getLogin().toLowerCase()).isPresent()) {
			return this.createBadRequest(userexists, "Login already in use");
		} else if (userRepository.findOneByEmail(user.getEmail()).isPresent()) {
			return this.createBadRequest("emailexists", "Email already in use");
		} else if (userRepository.findOneByFirstNameAndLastName(user.getFirstName(), user.getLastName()).isPresent()) {
			return this.createBadRequest("fullnameexists", "Full Name already in use");
		} else {

            user.setLangKey("pt_BR");
            user.setPassword(RandomUtil.generatePassword());
			mailService.sendCreationEmail(user);
			User userReadyToBeSaved = userService.prepareUserToBeSaved(user);
			User newUser = userRepository.save(userReadyToBeSaved);
			userSearchRepository.save(newUser);
			log.debug("Created Information for User: {}", user);
			return ResponseEntity.created(new URI("/api/users/" + newUser.getLogin()))
					.headers(HeaderUtil.createAlert("userManagement.created", newUser.getLogin())).body(newUser);
		}
	}

	private ResponseEntity createBadRequest(String errorKey, String defaultMessage) {
		return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, errorKey, defaultMessage))
				.body(null);
	}

	/**
	 * PUT /users : Updates an existing User.
	 *
	 * @param user the user to update
	 * @return the ResponseEntity with status 200 (OK) and with body the updated
	 *         user, or with status 400 (Bad Request) if the login or email is
	 *         already in use, or with status 500 (Internal Server Error) if the
	 *         user couldn't be updated
	 */
	@PutMapping("/users")
	@Timed
	@Secured(AuthoritiesConstants.USER)
	public ResponseEntity<User> updateUser(@RequestBody User user) {
		log.debug("REST request to update User : {}", user);
		// Verificação de consistência - Não pode haver dois usuários com e-mails iguais
		Optional<User> existingUser = userRepository.findOneByEmail(user.getEmail());
		if (existingUser.isPresent() && (!existingUser.get().getId().equals(user.getId()))) {
			return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "emailexists", "E-mail already in use"))
					.body(null);
		}
		// Verificação de consistência - Não pode haver dois usuários com logins iguais
		existingUser = userRepository.findOneByLogin(user.getLogin().toLowerCase());
		if (existingUser.isPresent() && (!existingUser.get().getId().equals(user.getId()))) {
			return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, userexists, "Login already in use"))
					.body(null);
		}
        // Verificação de consistência - Não pode haver dois usuários com nome completo iguais
		if (userRepository.findOneByFirstNameAndLastName(user.getFirstName(), user.getLastName()).isPresent()) {
            if (!userRepository.findOneByFirstNameAndLastName(user.getFirstName(), user.getLastName()).get().getId().equals(user.getId())) {
                return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "fullnameexists", "Full Name already in use"))
                    .body(null);
            }
        }
        // Verificando qual a autoridade do usuário logado
        Authority adminAuth = new Authority();
		adminAuth.setName(AuthoritiesConstants.ADMIN);
		adminAuth.setDescription("Administrador");
		// Restringindo os campos que o usuário comum pode alterar.
        if (!user.getAuthorities().contains(adminAuth) && userRepository.findOneById(user.getId()).isPresent()) {
            String newFirstName = user.getFirstName();
            String newLastName = user.getLastName();
            String newEmail = user.getEmail();
            user = userRepository.findOneById(user.getId()).get();
            user.setFirstName(newFirstName);
            user.setLastName(newLastName);
            user.setEmail(newEmail);
        }
        // Atualizando os dados do usuário
        User updatableUser = userService.generateUpdatableUser(user);
        User updatedUser = userRepository.save(updatableUser);
        userSearchRepository.save(updatedUser);
        log.debug("Changed Information for User: {}", user);

        return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, updatedUser.getId().toString()))
            .body(updatedUser);
	}

	/**
	 * GET /users : get all users.
	 *
	 * @param pageable the pagination information
	 * @return the ResponseEntity with status 200 (OK) and with body all users
	 * @throws URISyntaxException if the pagination headers couldn't be generated
	 */
	@GetMapping("/users")
	@Timed
	@Secured(AuthoritiesConstants.ADMIN)
	public ResponseEntity<List<UserDTO>> getAllUsers(@ApiParam Pageable pageable) throws URISyntaxException {
		final Page<UserDTO> page = userService.getAllManagedUsers(pageable);
		HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/users");
		return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
	}

	/**
	 * GET /users/:id : get the "id" user.
	 *
	 * @param id the id of the user to find
	 * @return the ResponseEntity with status 200 (OK) and with body the "login"
	 *         user, or with status 404 (Not Found)
	 */
	@GetMapping("/users/{id}")
	@Timed
	@Secured(AuthoritiesConstants.ADMIN)
	public User getUser(@PathVariable Long id) {
		log.debug("REST request to get User : {}", id);
		return userService.getUserWithAuthorities(id);
	}

    /**
     * GET /users/current : get the current logged user data.
     *
     * @return a User object containing user's data, or with status 404 (Not Found)
     */
    @GetMapping("/users/logged")
    @Timed
    @Secured(AuthoritiesConstants.USER)
    public User getLoggedUser() {
        log.debug("REST request to get current logged user");
        String login = SecurityUtils.getCurrentUserLogin();
        log.debug("====> User returned: {}", login);
        return userRepository.findOneWithAuthoritiesByLogin(login).orElse(null);
    }

	@GetMapping("/users/authorities")
	@Timed
	@Secured(AuthoritiesConstants.ADMIN)
	public ResponseEntity<List<Authority>> getAllAuthorities(@ApiParam Pageable pageable) throws URISyntaxException {
		final Page<Authority> page = authorityRepository.findAll(pageable);
		HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/users/authorities");
		return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
	}

	/**
	 * DELETE /users/:id : delete the "id" User.
	 *
	 * @param id the login of the user to delete
	 * @return the ResponseEntity with status 200 (OK)
	 */
	@DeleteMapping("/users/{id}")
	@Timed
	@Secured(AuthoritiesConstants.ADMIN)
	public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
		log.debug("REST request to delete User: {}", id);
        if (id == 3l) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME,userexists, "Você não pode excluir o usuário Administrador!"))
                .body(null);
        }else if(!analiseRepository.findByCreatedBy(id).isEmpty()) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME,"analiseexists", "Você não pode excluir o usuário pois ele é dono de uma ou mais análises!"))
                .body(null);
        }
        userService.deleteUser(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
	}

	/**
	 * SEARCH /_search/users/:query : search for the User corresponding to the
	 * query.
	 *
	 * @param query the query to search
	 * @return the result of the search
	 * @throws URISyntaxException
	 */
	@GetMapping("/_search/users")
	@Timed
	@Secured(AuthoritiesConstants.ADMIN)
	public ResponseEntity<List<User>> search(@RequestParam(defaultValue = "*") String query, @RequestParam String order,
			@RequestParam(name = "page") int pageNumber, @RequestParam int size,
			@RequestParam(defaultValue = "id") String sort) throws URISyntaxException {
		Sort.Direction sortOrder = PageUtils.getSortDirection(order);
		Pageable newPageable = new PageRequest(pageNumber, size, sortOrder, sort);

		Page<User> page = userSearchRepository.search(queryStringQuery(query), newPageable);
		HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/users");
		return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
	}

    @GetMapping(value = "/users/exportacao/{tipoRelatorio}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @Timed

    public ResponseEntity<InputStreamResource> gerarRelatorioExportacao(@PathVariable String tipoRelatorio, @RequestParam(defaultValue = "*") String query) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream;
        try {
            new NativeSearchQueryBuilder().withQuery(multiMatchQuery(query)).build();
            Page<User> result =  userSearchRepository.search(queryStringQuery(query), dynamicExportsService.obterPageableMaximoExportacao());
            byteArrayOutputStream = dynamicExportsService.export(new RelatorioUserColunas(), result, tipoRelatorio, Optional.empty(), Optional.ofNullable(AbacoUtil.REPORT_LOGO_PATH), Optional.ofNullable(AbacoUtil.getReportFooter()));
        } catch (DRException | ClassNotFoundException | JRException | NoClassDefFoundError e) {
            log.error(e.getMessage(), e);
            throw new RelatorioException(e);
        }
        return DynamicExporter.output(byteArrayOutputStream,
            "relatorio." + tipoRelatorio);
    }
}
