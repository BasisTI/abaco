package br.com.basis.abaco.service;

import br.com.basis.abaco.domain.Organizacao;
import br.com.basis.abaco.domain.Perfil;
import br.com.basis.abaco.domain.PerfilOrganizacao;
import br.com.basis.abaco.domain.Permissao;
import br.com.basis.abaco.domain.Sistema;
import br.com.basis.abaco.domain.User;
import br.com.basis.abaco.repository.PerfilRepository;
import br.com.basis.abaco.repository.PermissaoRepository;
import br.com.basis.abaco.repository.search.PerfilSearchRepository;
import br.com.basis.abaco.service.dto.AnaliseDTO;
import br.com.basis.abaco.service.dto.DropdownDTO;
import br.com.basis.abaco.service.dto.PerfilDTO;
import br.com.basis.abaco.service.exception.RelatorioException;
import br.com.basis.abaco.service.relatorio.RelatorioPerfilColunas;
import br.com.basis.abaco.utils.AbacoUtil;
import br.com.basis.dynamicexports.service.DynamicExportsService;
import net.sf.dynamicreports.report.exception.DRException;
import net.sf.jasperreports.engine.JRException;
import org.apache.commons.beanutils.BeanUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.elasticsearch.index.query.QueryBuilders.multiMatchQuery;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * Service Implementation for managing {@link Perfil}.
 */
@Service
@Transactional
public class PerfilService {

    private final Logger log = LoggerFactory.getLogger(PerfilService.class);

    private final PerfilRepository perfilRepository;

    private final PerfilSearchRepository perfilSearchRepository;

    private final PermissaoRepository permissaoRepository;

    private final DynamicExportsService dynamicExportsService;

    private final UserService userService;

    public PerfilService(PerfilRepository perfilRepository, PerfilSearchRepository perfilSearchRepository, PermissaoRepository permissaoRepository, DynamicExportsService dynamicExportsService, UserService userService) {
        this.perfilRepository = perfilRepository;
        this.perfilSearchRepository = perfilSearchRepository;
        this.permissaoRepository = permissaoRepository;
        this.dynamicExportsService = dynamicExportsService;
        this.userService = userService;
    }

    /**
     * Save a perfil.
     *
     * @param perfilDTO the entity to save.
     * @return the persisted entity.
     */
    public Perfil save(PerfilDTO perfilDTO) throws InvocationTargetException, IllegalAccessException {
        log.debug("Request to save Perfil : {}", perfilDTO);
        Perfil perfil = new Perfil();
        BeanUtils.copyProperties(perfil, perfilDTO);
        perfil.setPermissaos(perfilDTO.getPermissaos());
        perfil.setFlgAtivo(perfilDTO.getFlgAtivo());
        Perfil result = perfilRepository.save(perfil);
        perfilSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the perfils.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Perfil> findAll(Pageable pageable) {
        log.debug("Request to get all Perfils");
        return perfilRepository.findAll(pageable);
    }

    /**
     * Get one perfil by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Perfil> findOne(Long id) {
        log.debug("Request to get FuncionalidadeAbaco : {}", id);
        Optional<Perfil> perfil = perfilRepository.findById(id);

        if(perfil.isPresent()){
            Optional<List<Permissao>> permissaoList = permissaoRepository.findAllByPerfils(perfil.get());
            if(permissaoList.isPresent()) {
                perfil.get().setPermissaos(permissaoList.get().stream().collect(Collectors.toSet()));
            }
        }
        return perfil;
    }

    /**
     * Delete the perfil by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Perfil : {}", id);
        perfilRepository.delete(id);
        perfilSearchRepository.delete(id);
    }

    public ByteArrayOutputStream gerarRelatorio(String query, String tipoRelatorio) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream;
        try {
            new NativeSearchQueryBuilder().withQuery(multiMatchQuery(query)).build();
            Page<Perfil> result = perfilSearchRepository.search(queryStringQuery(query), dynamicExportsService.obterPageableMaximoExportacao());
            byteArrayOutputStream = dynamicExportsService.export(new RelatorioPerfilColunas(), result, tipoRelatorio, Optional.empty(), Optional.ofNullable(AbacoUtil.REPORT_LOGO_PATH), Optional.ofNullable(AbacoUtil.getReportFooter()));
        } catch (DRException | ClassNotFoundException | JRException | NoClassDefFoundError e) {
            throw new RelatorioException(e);
        }
        return byteArrayOutputStream;
    }


    @Transactional(readOnly = true)
    public List<DropdownDTO> getPerfilDropdown() {
        return perfilRepository.getPerfilDropdown();
    }

    public static boolean consultarPerfilPesquisar(Perfil perfil, String funcionalidadeSigla){
        if(!perfil.getPermissaos().isEmpty()){
            for (Permissao permissao : perfil.getPermissaos()) {
                if(permissao.getFuncionalidadeAbaco().getSigla().contains(funcionalidadeSigla)
                    && permissao.getAcao().getSigla().contains("PESQUISAR")){
                    return true;
                }
            }
        }
        return false;
    }

    public List<Organizacao> consultarPerfilOrganizacoes(String funcionalidade){
        List<Organizacao> organizacaoList = new ArrayList<>();
        User user = userService.getUserWithAuthorities();
        if(!user.getPerfilOrganizacoes().isEmpty()) {
            for (int i = 0; i < user.getPerfilOrganizacoes().size(); i++) {
                PerfilOrganizacao perfilOrganizacao = user.getPerfilOrganizacoes().get(i);
                Perfil perfil = perfilOrganizacao.getPerfil();
                if(PerfilService.consultarPerfilPesquisar(perfil, funcionalidade) == true){
                    organizacaoList.addAll(perfilOrganizacao.getOrganizacoes());
                }
            }
        }
        return organizacaoList;
    }

    public Page<Organizacao> validarPerfilOrganizacoes(Page<Organizacao> page, Pageable pageable){
        List<Organizacao> organizacoes = new ArrayList<>();
        List<Organizacao> organizacoesPermitidas = consultarPerfilOrganizacoes("ORGANIZACAO");
        organizacoesPermitidas.forEach(organizacao -> {
            if(page.getContent().contains(organizacao)){
                organizacoes.add(organizacao);
            }
        });
        return new PageImpl<Organizacao>(
            organizacoes.subList(pageable.getOffset(), pageable.getOffset() + pageable.getPageSize() > organizacoes.size() ? organizacoes.size() : (pageable.getOffset() + pageable.getPageSize()))
            , pageable, organizacoes.size());
    }



    public Page<Sistema> validarPerfilSistema(Page<Sistema> page, Pageable pageable) {
        List<Sistema> totalSistema = new ArrayList<>();
        List<Organizacao> organizacoesPermitidas = consultarPerfilOrganizacoes("SISTEMA");
        page.getContent().forEach(sistema -> {
            if(organizacoesPermitidas.contains(sistema.getOrganizacao())){
                totalSistema.add(sistema);
            }
        });
        Page<Sistema> newPage = new PageImpl<Sistema>(
            totalSistema.subList(pageable.getOffset(), pageable.getOffset() + pageable.getPageSize() > totalSistema.size() ? totalSistema.size() : (pageable.getOffset() + pageable.getPageSize()))
            , pageable, totalSistema.size());
        return newPage;
    }

    public Page<AnaliseDTO> validarPerfilAnalise(Page<AnaliseDTO> page, Pageable pageable, boolean isDivergence){
        List<AnaliseDTO> totalAnalise = new ArrayList<>();
        List<Organizacao> organizacoesPermitidas = consultarPerfilOrganizacoes(isDivergence ? "VALIDACAO" : "ANALISE");
        page.getContent().forEach(analise -> {
            for (Organizacao organizacao : organizacoesPermitidas) {
                if(organizacao.getId().equals(analise.getOrganizacao().getId())){
                    totalAnalise.add(analise);
                }
            }
        });
        Page<AnaliseDTO> newPage = new PageImpl<AnaliseDTO>(
            totalAnalise.subList(pageable.getOffset(), pageable.getOffset() + pageable.getPageSize() > totalAnalise.size() ? totalAnalise.size() : (pageable.getOffset() + pageable.getPageSize()))
            , pageable, totalAnalise.size());
        return newPage;
    }
}
