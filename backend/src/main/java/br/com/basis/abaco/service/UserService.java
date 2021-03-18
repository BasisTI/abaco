package br.com.basis.abaco.service;

import br.com.basis.abaco.config.Constants;
import br.com.basis.abaco.domain.Perfil;
import br.com.basis.abaco.domain.User;
import br.com.basis.abaco.repository.PerfilRepository;
import br.com.basis.abaco.repository.UserRepository;
import br.com.basis.abaco.repository.search.UserSearchRepository;
import br.com.basis.abaco.security.SecurityUtils;
import br.com.basis.abaco.service.dto.UserAnaliseDTO;
import br.com.basis.abaco.service.dto.UserDTO;
import br.com.basis.abaco.service.dto.UserEditDTO;
import br.com.basis.abaco.service.dto.filter.UserFilterDTO;
import br.com.basis.abaco.service.exception.RelatorioException;
import br.com.basis.abaco.service.relatorio.RelatorioUserColunas;
import br.com.basis.abaco.service.util.RandomUtil;
import br.com.basis.abaco.utils.AbacoUtil;
import br.com.basis.dynamicexports.service.DynamicExportsService;
import net.sf.dynamicreports.report.exception.DRException;
import net.sf.jasperreports.engine.JRException;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.SearchQuery;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.elasticsearch.index.query.QueryBuilders.boolQuery;
import static org.elasticsearch.index.query.QueryBuilders.nestedQuery;

/**
 * Service class for managing users.
 */
@Service
@Transactional
public class UserService extends BaseService {

    private final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final SocialService socialService;

    private final UserSearchRepository userSearchRepository;

    private final DynamicExportsService dynamicExportsService;

    private final PerfilRepository perfilRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, SocialService socialService,
                       UserSearchRepository userSearchRepository, DynamicExportsService dynamicExportsService, PerfilRepository perfilRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.socialService = socialService;
        this.userSearchRepository = userSearchRepository;
        this.dynamicExportsService = dynamicExportsService;
        this.perfilRepository = perfilRepository;
    }

    public Optional<User> activateRegistration(String key) {
        log.debug("Activating user for activation key {}", key);
        return userRepository.findOneByActivationKey(key).map(user -> {
            // activate given user for the registration key.
            user.setActivated(true);
            user.setActivationKey(null);
            userRepository.save(user);
            userSearchRepository.save(user);
            log.debug("Activated user: {}", user);
            return user;
        });
    }

    public Optional<User> completePasswordReset(String newPassword, String key) {
        log.debug("Reset user password for reset key {}", key);

        return userRepository.findOneByResetKey(key).filter(user -> {
            ZonedDateTime oneDayAgo = ZonedDateTime.now().minusHours(24);
            return user.getResetDate().isAfter(oneDayAgo);
        }).map(user -> {
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setResetKey(null);
            user.setResetDate(null);
            return user;
        });
    }

    public Optional<User> requestPasswordReset(String mail) {
        return userRepository.findOneByEmail(mail).filter(User::isActivated).map(user -> {
            user.setResetKey(RandomUtil.generateResetKey());
            user.setResetDate(ZonedDateTime.now());
            return user;
        });
    }

    public Optional<User> requestPasswordResetUser(String login) {
        return userRepository.findOneByLogin(login).filter(User::isActivated).map(user -> {
            user.setResetKey(RandomUtil.generateResetKey());
            user.setResetDate(ZonedDateTime.now());
            return user;
        });
    }


    public User createUser(String login, String password, String firstName, String lastName, String email,
                           String imageUrl, String langKey) {
        User newUser = new User();
        String encryptedPassword = passwordEncoder.encode(password);
        newUser.setLogin(login);
        newUser.setPassword(encryptedPassword);
        newUser.setFirstName(firstName);
        newUser.setLastName(lastName);
        newUser.setEmail(email);
        newUser.setImageUrl(imageUrl);
        newUser.setLangKey(langKey);
        newUser.setActivated(false);
        newUser.setActivationKey(RandomUtil.generateActivationKey());
        userRepository.save(newUser);
        userSearchRepository.save(newUser);
        return newUser;
    }

    public User createUser(UserDTO userDTO) {
        User user = new User();
        setBaseUserProperties(userDTO, user);
        if (userDTO.getLangKey() == null) {
            // default language
            user.setLangKey("pt-br");
        } else {
            user.setLangKey(userDTO.getLangKey());
        }
        setUserProperties(user);
        userRepository.save(user);
        userSearchRepository.save(user);
        log.debug("Created Information for User: {}", user);
        return user;
    }

    private void setBaseUserProperties(UserDTO userDTO, User user) {
        user.setLogin(userDTO.getLogin());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setEmail(userDTO.getEmail());
        user.setImageUrl(userDTO.getImageUrl());
    }

    private void setUserProperties(User user) {
        String encryptedPassword = passwordEncoder.encode(RandomUtil.generatePassword());
        user.setPassword(encryptedPassword);
        user.setResetKey(RandomUtil.generateResetKey());
        user.setResetDate(ZonedDateTime.now());
        user.setActivated(true);
    }

    /**
     * Copies (shallow) an User and then: 1 - Set language key if not present 2 -
     * Set a generated password 3 - Set a generated resetKey
     *
     * @param user
     * @return
     */
    public User prepareUserToBeSaved(User user) {
        User userCopy = shallowCopyUser(user);
        String encryptedPassword = passwordEncoder.encode(userCopy.getPassword());
        userCopy.setPassword(encryptedPassword);
        userCopy.setResetKey(RandomUtil.generateResetKey());
        userCopy.setResetDate(ZonedDateTime.now());
        userCopy.setPerfils(user.getPerfils());
        return userCopy;
    }

    public User generateUpdatableUser(User userToBeUpdated) {
        User userPreUpdate = userRepository.findOne(userToBeUpdated.getId());
        User updatableUser = shallowCopyUser(userToBeUpdated);
        if (updatableUser.getPassword() == null) {
            updatableUser.setPassword(userPreUpdate.getPassword());
        }
        if (updatableUser.getLangKey() == null) {
            updatableUser.setLangKey(userPreUpdate.getLangKey());
        }

        return updatableUser;
    }

    private User shallowCopyUser(User user) {
        User copy = new User();
        copy.setId(user.getId());
        copy.setLogin(user.getLogin());
        copy.setPassword(user.getPassword());
        copy.setFirstName(user.getFirstName());
        copy.setLastName(user.getLastName());
        copy.setEmail(user.getEmail());
        copy.setActivated(user.isActivated());
        copy.setLangKey(user.getLangKey());
        copy.setImageUrl(user.getImageUrl());
        copy.setActivationKey(user.getActivationKey());
        copy.setResetKey(user.getResetKey());
        copy.setResetDate(user.getResetDate());
        copy.setPerfils(user.getPerfils());
        copy.setTipoEquipes(user.getTipoEquipes());
        copy.setOrganizacoes(user.getOrganizacoes());
        return copy;
    }

    /**
     * Update basic information (first name, last name, email, language) for the
     * current user.
     */
    public void updateUser(String firstName, String lastName, String email, String langKey) {
        userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).ifPresent(user -> {
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setEmail(email);
            user.setLangKey(langKey);
            userRepository.save(user);
            userSearchRepository.save(user);
            log.debug("Changed Information for User: {}", user);
        });
    }


    public void deleteUser(Long id) {
        userRepository.findOneById(id).ifPresent(user -> {
            socialService.deleteUserSocialConnection(user.getLogin());
            userRepository.delete(user);
            userSearchRepository.delete(user);
            log.debug("Deleted User: {}", user);
        });
    }

    public void changePassword(String password) {
        userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).ifPresent(user -> {
            String encryptedPassword = passwordEncoder.encode(password);
            user.setPassword(encryptedPassword);
            log.debug("Changed password for User: {}", user);
        });
    }

    @Transactional(readOnly = true)
    public Page<UserDTO> getAllManagedUsers(Pageable pageable) {
        return userRepository.findAllByLoginNot(pageable, Constants.ANONYMOUS_USER).map(UserDTO::new);
    }

    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsersOrgEquip(Long idOrg, Long idEquip) {
        List<User> lista = userRepository.findAllUsersOrgEquip(idOrg, idEquip);
        List<UserDTO> lst = new ArrayList<>();
        for (int i = 0; i < lista.size(); i++) {
            lst.add(new UserDTO(lista.get(i)));
        }
        return lst;
    }

    @Transactional(readOnly = true)
    public List<UserAnaliseDTO> getAllUserDtosOrgEquip(Long idOrg, Long idEquip) {
        List<User> lista = userRepository.findAllUsersOrgEquip(idOrg, idEquip);
        List<UserAnaliseDTO> lst = new ArrayList<>();
        for (int i = 0; i < lista.size(); i++) {
            lst.add(new ModelMapper().map(lista.get(i), UserAnaliseDTO.class));
        }
        return lst;
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthoritiesByLogin(String login) {
        return userRepository.findOneWithAuthoritiesByLogin(login);
    }

    @Transactional(readOnly = true)
    public User getUserWithAuthorities(Long id) {
        User user = userRepository.findOneWithAuthoritiesById(id);
        Optional<List<Perfil>> listPerfil = perfilRepository.findAllByUsers(user);
        if(listPerfil.isPresent()){
            user.setPerfils(listPerfil.get().stream().collect(Collectors.toSet()));
        }
        return user;
    }

    @Transactional(readOnly = true)
    public User getUserWithAuthorities() {
        return userRepository.findOneWithAuthoritiesByLogin(SecurityUtils.getCurrentUserLogin()).orElse(null);
    }

    public BoolQueryBuilder bindFilterSearch(String nome, String login, String email, Long [] organizacao, Long[] perfil, Long[] equipeId) {
        BoolQueryBuilder qb = new BoolQueryBuilder();
        mustMatchWildcardContainsQueryLowerCase(nome, qb, "nome");
        mustMatchWildcardContainsQueryLowerCase(login, qb, "login");
        mustMatchWildcardContainsQueryLowerCase(email, qb, "email");
        if(organizacao != null && organizacao.length > 0 ){
            BoolQueryBuilder boolQueryBuilderOrganizacao = QueryBuilders.boolQuery()
            .must(
                nestedQuery(
                    "organizacoes",
                    boolQuery().must(QueryBuilders.termsQuery("organizacoes.id", organizacao))
                )
            );
            qb.must(boolQueryBuilderOrganizacao);
        }
        if(perfil != null && perfil.length > 0 ){
            BoolQueryBuilder boolQueryBuilderOrganizacao = QueryBuilders.boolQuery()
                .must(
                    nestedQuery(
                        "perfils",
                        boolQuery().must(QueryBuilders.termsQuery("perfils.id", perfil))
                    )
                );
            qb.must(boolQueryBuilderOrganizacao);
        }
        if(equipeId != null && equipeId.length > 0 ){
            BoolQueryBuilder boolQueryBuilderOrganizacao = QueryBuilders.boolQuery()
                .must(
                    nestedQuery(
                        "tipoEquipes",
                        boolQuery().must(QueryBuilders.termsQuery("tipoEquipes.id", equipeId))
                    )
                );
            qb.must(boolQueryBuilderOrganizacao);
        }
        return qb;
    }

    public Long getLoggedUserId() {
        return userRepository.getLoggedUserId(SecurityUtils.getCurrentUserLogin());
    }

    public UserEditDTO convertToDto(User user) {
        return new ModelMapper().map(user, UserEditDTO.class);
    }

    public User convertToEntity(UserEditDTO userEditDTO) {
        return new ModelMapper().map(userEditDTO, User.class);
    }

    public User bindUserForSaveElatiscSearch(User user){
        return convertToEntity(convertToDto(user));
    }

    public User setUserToSave(User user) {
        Optional<User> oldUserdata = userRepository.findOneById(user.getId());
        User userTmp = bindUser(user, oldUserdata);
        User updatableUser = generateUpdatableUser(userTmp);
        updatableUser.setPerfils(user.getPerfils());
        updatableUser.setOrganizacoes(user.getOrganizacoes());
        updatableUser.setTipoEquipes(user.getTipoEquipes());
        User updatedUser = userRepository.save(updatableUser);
        return userSearchRepository.save(bindUserForSaveElatiscSearch(updatedUser));
    }

    private User bindUser(User user, Optional<User> oldUserdata) {
        User userTmp;
        if (oldUserdata.isPresent()) {
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

    public User getLoggedUser() {
        String login = SecurityUtils.getCurrentUserLogin();
        return userRepository.findOneWithAuthoritiesByLogin(login).orElse(null);
    }

    public ByteArrayOutputStream gerarRelatorio(UserFilterDTO filtro, String tipoRelatorio) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream;
        try {
            BoolQueryBuilder qb = bindFilterSearch(filtro.getNome(), filtro.getLogin(), filtro.getEmail(), filtro.getOrganizacao() == null ? null : filtro.getOrganizacao().stream().toArray(Long[]::new), filtro.getPerfil()== null ? null : filtro.getPerfil().stream().toArray(Long[]::new), filtro.getEquipe()== null ? null : filtro.getEquipe().stream().toArray(Long[]::new));
            SearchQuery searchQuery = new NativeSearchQueryBuilder().withQuery(qb).withPageable(dynamicExportsService.obterPageableMaximoExportacao()).build();
            Page<User> page = userSearchRepository.search(searchQuery);
            byteArrayOutputStream = dynamicExportsService.export(new RelatorioUserColunas(filtro.getColumnsVisible()), page, tipoRelatorio,
                Optional.empty(), Optional.ofNullable(AbacoUtil.REPORT_LOGO_PATH),
                Optional.ofNullable(AbacoUtil.getReportFooter()));
        } catch (DRException | ClassNotFoundException | JRException | NoClassDefFoundError e) {
            throw new RelatorioException(e);
        }

        return byteArrayOutputStream;
    }

}
