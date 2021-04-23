package br.com.basis.abaco.service;

import br.com.basis.abaco.domain.Perfil;
import br.com.basis.abaco.domain.Permissao;
import br.com.basis.abaco.repository.PerfilRepository;
import br.com.basis.abaco.repository.PermissaoRepository;
import br.com.basis.abaco.repository.search.PerfilSearchRepository;
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
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.lang.reflect.InvocationTargetException;
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

    public PerfilService(PerfilRepository perfilRepository, PerfilSearchRepository perfilSearchRepository, PermissaoRepository permissaoRepository, DynamicExportsService dynamicExportsService) {
        this.perfilRepository = perfilRepository;
        this.perfilSearchRepository = perfilSearchRepository;
        this.permissaoRepository = permissaoRepository;
        this.dynamicExportsService = dynamicExportsService;
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
            if(permissaoList.isPresent())
            perfil.get().setPermissaos(permissaoList.get().stream().collect(Collectors.toSet()));
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
}
