package br.com.basis.abaco.web.rest;

import java.io.ByteArrayOutputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.search.sort.FieldSortBuilder;
import org.elasticsearch.search.sort.SortOrder;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.SearchQuery;
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

import com.codahale.metrics.annotation.Timed;

import br.com.basis.abaco.domain.Authority;
import br.com.basis.abaco.domain.Organizacao;
import br.com.basis.abaco.domain.User;
import br.com.basis.abaco.repository.AnaliseRepository;
import br.com.basis.abaco.repository.AuthorityRepository;
import br.com.basis.abaco.repository.UserRepository;
import br.com.basis.abaco.repository.search.UserSearchRepository;
import br.com.basis.abaco.security.AuthoritiesConstants;
import br.com.basis.abaco.security.SecurityUtils;
import br.com.basis.abaco.service.MailService;
import br.com.basis.abaco.service.UserService;
import br.com.basis.abaco.service.dto.UserAnaliseDTO;
import br.com.basis.abaco.service.dto.UserDTO;
import br.com.basis.abaco.service.dto.UserEditDTO;
import br.com.basis.abaco.service.dto.filter.UserFilterDTO;
import br.com.basis.abaco.service.exception.RelatorioException;
import br.com.basis.abaco.service.util.RandomUtil;
import br.com.basis.abaco.utils.PageUtils;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import br.com.basis.abaco.web.rest.util.PaginationUtil;
import br.com.basis.dynamicexports.util.DynamicExporter;
import io.swagger.annotations.ApiParam;

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
    private String userexists = "userexists";

    public UserResource(UserRepository userRepository,
                        MailService mailService,
                        UserService userService,
                        UserSearchRepository userSearchRepository,
                        AuthorityRepository authorityRepository,
                        AnaliseRepository analiseRepository) {
        this.analiseRepository = analiseRepository;
        this.userRepository = userRepository;
        this.mailService = mailService;
        this.userService = userService;
        this.userSearchRepository = userSearchRepository;
        this.authorityRepository = authorityRepository;
    }

    @PostMapping("/users")
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
            userRepository.save(userReadyToBeSaved);
            User newUser = userSearchRepository.save(userReadyToBeSaved);
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
        User updatedUser = userService.setUserToSave(user);
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
    @GetMapping("/users-dto/{organizacaoId}/{equipeId}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.GESTOR, AuthoritiesConstants.ANALISTA})
    public List<UserAnaliseDTO> getAllUserDtosFronSistemaAndOrganizacao(@PathVariable Long organizacaoId, @PathVariable Long equipeId) throws URISyntaxException {
        return userService.getAllUserDtosOrgEquip(organizacaoId, equipeId);
    }

    @GetMapping("/users/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.GESTOR})
    public UserEditDTO getUser(@PathVariable Long id) {
        return  userService.convertToDto(userService.getUserWithAuthorities(id));
    }

    @GetMapping("/users/logged")
    @Timed
    public UserEditDTO getLoggedUser() {
        String login = SecurityUtils.getCurrentUserLogin();
        return userService.convertToDto(userRepository.findOneWithAuthoritiesByLogin(login).orElse(null));
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
    public ResponseEntity<List<User>> search(@RequestParam (defaultValue = "ASC", required = false)String order,
                                             @RequestParam(name = "page", defaultValue = "0" ,required = false) int pageNumber,
                                             @RequestParam int size,
                                             @RequestParam(value = "nome", required = false) String nome,
                                             @RequestParam(value = "login", required = false) String login,
                                             @RequestParam(value = "email", required = false) String email,
                                             @RequestParam(value = "organizacao", required = false) Long[] organizacao,
                                             @RequestParam(value = "perfil", required = false) String[] perfil,
                                             @RequestParam(value = "equipe", required = false) Long[] equipe,
                                             @RequestParam(defaultValue = "id") String sort) throws URISyntaxException {
        Sort.Direction sortOrder = PageUtils.getSortDirection(order);
        Pageable pageable = new PageRequest(pageNumber, size, sortOrder, sort);
        FieldSortBuilder sortBuilder = new FieldSortBuilder(sort).order(SortOrder.ASC);
        BoolQueryBuilder qb = userService.bindFilterSearch(nome, login, email, organizacao, perfil, equipe);
        SearchQuery searchQuery = new NativeSearchQueryBuilder().withQuery(qb).withPageable(pageable).withSort(sortBuilder).build();
        Page<User> page = userSearchRepository.search(searchQuery);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page,"/api/_search/users");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @PostMapping(value = "/users/exportacao/{tipoRelatorio}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @Timed
    public ResponseEntity<InputStreamResource> gerarRelatorioExportacao(@PathVariable String tipoRelatorio,@RequestBody UserFilterDTO filtro) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream = userService.gerarRelatorio(filtro, tipoRelatorio);
        return DynamicExporter.output(byteArrayOutputStream, "relatorio." + tipoRelatorio);
    }

    @PostMapping(value = "/users/exportacao-arquivo", produces = MediaType.APPLICATION_PDF_VALUE)
    @Timed
    public ResponseEntity<byte[]> gerarRelatorioImprimir(@RequestBody UserFilterDTO filtro) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream = userService.gerarRelatorio(filtro, "pdf");
        return new ResponseEntity<byte[]>(byteArrayOutputStream.toByteArray(), HttpStatus.OK);
    }
    
    

    @GetMapping("/users/active-user")
    @Timed
    public Long getLoggedUserId() {
        return userService.getLoggedUserId();
    }

    @GetMapping("/users/drop-down")
    @Timed
    @Transactional
    public List<UserAnaliseDTO> getOrganizacaoDropdown() {
        List<User> lstUser =  userRepository.getAllByFirstNameIsNotNullOrderByFirstName();
        ModelMapper modelMapper = new ModelMapper();
        List<UserAnaliseDTO> lstUserDto = lstUser.stream()
            .map(user -> modelMapper.map(user, UserAnaliseDTO.class))
            .collect(Collectors.toList());
        return lstUserDto;
    }

    @PostMapping("/users/drop-down/organizacao")
    @Timed
    @Transactional
    public List<UserAnaliseDTO> getUserInOrganizacao(@RequestBody List<Organizacao>organizacoes) {
        List<User> lstUser =  userRepository.findDistinctByOrganizacoesInOrderByFirstName(organizacoes);
        ModelMapper modelMapper = new ModelMapper();
        List<UserAnaliseDTO> lstUserDto = lstUser.stream()
            .map(user -> modelMapper.map(user, UserAnaliseDTO.class))
            .collect(Collectors.toList());
        return lstUserDto;
    }

    private ResponseEntity createBadRequest(String errorKey, String defaultMessage) {
        return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, errorKey, defaultMessage))
                .body(null);
    }
}
