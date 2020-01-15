package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.Authority;
import br.com.basis.abaco.domain.User;
import br.com.basis.abaco.repository.AnaliseRepository;
import br.com.basis.abaco.repository.AuthorityRepository;
import br.com.basis.abaco.repository.UserRepository;
import br.com.basis.abaco.repository.search.UserSearchRepository;
import br.com.basis.abaco.security.AuthoritiesConstants;
import br.com.basis.abaco.security.SecurityUtils;
import br.com.basis.abaco.service.MailService;
import br.com.basis.abaco.service.UserService;
import br.com.basis.abaco.service.dto.UserDTO;
import br.com.basis.abaco.service.exception.RelatorioException;
import br.com.basis.abaco.service.relatorio.RelatorioUserColunas;
import br.com.basis.abaco.service.util.RandomUtil;
import br.com.basis.abaco.utils.AbacoUtil;
import br.com.basis.abaco.utils.PageUtils;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import br.com.basis.abaco.web.rest.util.PaginationUtil;
import br.com.basis.dynamicexports.service.DynamicExportsService;
import br.com.basis.dynamicexports.util.DynamicExporter;
import com.codahale.metrics.annotation.Timed;
import io.swagger.annotations.ApiParam;
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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.multiMatchQuery;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

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
    private final ElasticsearchIndexResource elasticSearchIndexService;

    public UserResource(UserRepository userRepository, MailService mailService, UserService userService,
                        UserSearchRepository userSearchRepository, AuthorityRepository authorityRepository,
                        DynamicExportsService dynamicExportsService, AnaliseRepository analiseRepository,
                        ElasticsearchIndexResource elasticSearchIndexService) {
        this.analiseRepository = analiseRepository;
        this.userRepository = userRepository;
        this.mailService = mailService;
        this.userService = userService;
        this.userSearchRepository = userSearchRepository;
        this.authorityRepository = authorityRepository;
        this.dynamicExportsService = dynamicExportsService;
        this.elasticSearchIndexService = elasticSearchIndexService;
    }

    @PostMapping("")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.GESTOR})
    public ResponseEntity createUser(@RequestBody User user) throws URISyntaxException {
        log.debug("REST request to save User : {}", user);
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
            return ResponseEntity.created(new URI("/api/users/" + newUser.getLogin()))
                    .headers(HeaderUtil.createAlert("userManagement.created", newUser.getLogin())).body(newUser);
        }
    }

    @PutMapping("/users")
    @Timed
    @Secured({AuthoritiesConstants.USER, AuthoritiesConstants.ADMIN, AuthoritiesConstants.GESTOR, AuthoritiesConstants.VIEW, AuthoritiesConstants.ANALISTA})
    public ResponseEntity<User> updateUser(@RequestBody User user) {
        Optional<User> existingUser = userRepository.findOneByEmail(user.getEmail());
        if (existingUser.isPresent() && (!existingUser.get().getId().equals(user.getId()))) {
            return ResponseEntity.badRequest()
                    .headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "emailexists", "E-mail already in use")).body(null);
        }
        existingUser = userRepository.findOneByLogin(user.getLogin().toLowerCase());
        if (existingUser.isPresent() && (!existingUser.get().getId().equals(user.getId()))) {
            return ResponseEntity.badRequest()
                    .headers(HeaderUtil.createFailureAlert(ENTITY_NAME, userexists, "Login already in use")).body(null);
        }
        User updatedUser = getUser(user);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, updatedUser.getId().toString())).body(updatedUser);
    }

    @GetMapping("/users")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.GESTOR})
    public ResponseEntity<List<UserDTO>> getAllUsers(@ApiParam Pageable pageable) throws URISyntaxException {
        final Page<UserDTO> page = userService.getAllManagedUsers(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/users");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @GetMapping("/users/{organizacaoId}/{equipeId}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.GESTOR, AuthoritiesConstants.ANALISTA})
    public List<UserDTO> getAllUsersFronSistemaAndOrganizacao(@PathVariable Long organizacaoId, @PathVariable Long equipeId) throws URISyntaxException {
        return userService.getAllUsersOrgEquip(organizacaoId, equipeId);
    }

    @GetMapping("/users/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.GESTOR})
    public User getUser(@PathVariable Long id) {
        return userService.getUserWithAuthorities(id);
    }

    @GetMapping("/users/logged")
    @Timed
    public User getLoggedUser() {
        String login = SecurityUtils.getCurrentUserLogin();
        return userRepository.findOneWithAuthoritiesByLogin(login).orElse(null);
    }

    @GetMapping("/users/authorities")
    @Timed
    public ResponseEntity<List<Authority>> getAllAuthorities(@ApiParam Pageable pageable) throws URISyntaxException {
        final Page<Authority> page = authorityRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/users/authorities");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @DeleteMapping("/users/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.GESTOR})
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (id == 3l) {
            return ResponseEntity.badRequest()
                    .headers(
                            HeaderUtil.createFailureAlert(ENTITY_NAME, userexists, "Você não pode excluir o usuário Administrador!"))
                    .body(null);
        } else if (!analiseRepository.findByCreatedBy(id).isEmpty()) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "analiseexists",
                    "Você não pode excluir o usuário pois ele é dono de uma ou mais análises!")).body(null);
        }
        userService.deleteUser(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @GetMapping("/_search/users")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.GESTOR})
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
    public ResponseEntity<InputStreamResource> gerarRelatorioExportacao(@PathVariable String tipoRelatorio,
                                                                        @RequestParam(defaultValue = "*") String query) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream;
        try {
            new NativeSearchQueryBuilder().withQuery(multiMatchQuery(query)).build();
            Page<User> result = userSearchRepository.search(queryStringQuery(query),
                    dynamicExportsService.obterPageableMaximoExportacao());
            byteArrayOutputStream = dynamicExportsService.export(new RelatorioUserColunas(), result, tipoRelatorio,
                    Optional.empty(), Optional.ofNullable(AbacoUtil.REPORT_LOGO_PATH),
                    Optional.ofNullable(AbacoUtil.getReportFooter()));
        } catch (DRException | ClassNotFoundException | JRException | NoClassDefFoundError e) {
            log.error(e.getMessage(), e);
            throw new RelatorioException(e);
        }
        return DynamicExporter.output(byteArrayOutputStream, "relatorio." + tipoRelatorio);
    }

    @GetMapping("/users/active-user")
    @Timed
    public Long getLoggedUserId() {
        return userService.getLoggedUserId();
    }

    private User getUser(User user) {
        Authority adminAuth = new Authority();
        adminAuth.setName(AuthoritiesConstants.ADMIN);
        adminAuth.setDescription("Administrador");
        Optional<User> oldUserdata = userRepository.findOneById(user.getId());
        User loggedUser = this.getLoggedUser();
        User userTmp;
        userTmp = bindUser(user, oldUserdata, loggedUser);
        User updatableUser = userService.generateUpdatableUser(userTmp);
        User updatedUser = userRepository.save(updatableUser);
        userSearchRepository.save(updatedUser);
        return updatedUser;
    }

    @GetMapping("/users/drop-down")
    @Timed
    @Transactional
    public List<User> getOrganizacaoDropdown() {
        return userRepository.getAllByFirstNameIsNotNullOrderByFirstName();
    }

    @GetMapping("/users/reindexar")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.GESTOR})
    public void reindexarUSer() {
        List<String> list = new ArrayList<>();
        list.add("userList");
        this.elasticSearchIndexService.reindexar(list);
    }

    private User bindUser(User user, Optional<User> oldUserdata, User loggedUser) {
        User userTmp;
        if (!loggedUser.verificarAuthority() && oldUserdata.isPresent()) {
            String newFirstName = user.getFirstName();
            String newLastName = user.getLastName();
            String newEmail = user.getEmail();
            userTmp = oldUserdata.get();
            userTmp.setFirstName(newFirstName);
            userTmp.setLastName(newLastName);
            userTmp.setEmail(newEmail);
        } else {
            userTmp = user;
        }
        return userTmp;
    }

    private ResponseEntity createBadRequest(String errorKey, String defaultMessage) {
        return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, errorKey, defaultMessage))
                .body(null);
    }
}
