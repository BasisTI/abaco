package br.com.basis.abaco.service;

import br.com.basis.abaco.domain.Status;
import br.com.basis.abaco.domain.TipoEquipe;
import br.com.basis.abaco.repository.TipoEquipeRepository;
import br.com.basis.abaco.repository.search.TipoEquipeSearchRepository;
import br.com.basis.abaco.security.SecurityUtils;
import br.com.basis.abaco.service.dto.DropdownDTO;
import br.com.basis.abaco.service.dto.TipoEquipeDTO;
import br.com.basis.abaco.service.exception.RelatorioException;
import br.com.basis.abaco.service.relatorio.RelatorioStatusColunas;
import br.com.basis.abaco.service.relatorio.RelatorioTipoEquipeColunas;
import br.com.basis.abaco.utils.AbacoUtil;
import br.com.basis.dynamicexports.service.DynamicExportsService;
import net.sf.dynamicreports.report.exception.DRException;
import net.sf.jasperreports.engine.JRException;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.elasticsearch.index.query.QueryBuilders.multiMatchQuery;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

@Service
@Transactional
public class TipoEquipeService {

    private final TipoEquipeRepository tipoEquipeRepository;
    private final TipoEquipeSearchRepository tipoEquipeSearchRepository;
    private final DynamicExportsService dynamicExportsService;

    public TipoEquipeService(TipoEquipeRepository tipoEquipeRepository, TipoEquipeSearchRepository tipoEquipeSearchRepository, DynamicExportsService dynamicExportsService) {
        this.tipoEquipeRepository = tipoEquipeRepository;
        this.tipoEquipeSearchRepository = tipoEquipeSearchRepository;
        this.dynamicExportsService = dynamicExportsService;
    }

    @Transactional(readOnly = true)
    public List<DropdownDTO> getTipoEquipeDropdown() {
        return tipoEquipeRepository.getTipoEquipeDropdown();
    }

    @Transactional(readOnly = true)
    public List<DropdownDTO> findActiveUserTipoEquipes() {
        return tipoEquipeRepository.findActiveUserTipoEquipes(SecurityUtils.getCurrentUserLogin());
    }

    public TipoEquipeDTO convertToDto(TipoEquipe tipoEquipe) {
        return new ModelMapper().map(tipoEquipe, TipoEquipeDTO.class);
    }

    public TipoEquipe convertToEntity(TipoEquipeDTO tipoEquipeDTO) {
        return new ModelMapper().map(tipoEquipeDTO, TipoEquipe.class);
    }

    public TipoEquipe setEntityToElatischSearch(TipoEquipe tipoEquipe){
        return convertToEntity(convertToDto(tipoEquipe));
    }
    public List<TipoEquipeDTO> convert(List<TipoEquipe> lstTipoEquipe) {
        return lstTipoEquipe.stream().map(this::convertToDto)
            .collect(Collectors.toList());
    }

    public ByteArrayOutputStream gerarRelatorio(String query, String tipoRelatorio) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream;
        try {
            new NativeSearchQueryBuilder().withQuery(multiMatchQuery(query)).build();
            Page<TipoEquipe> result = tipoEquipeSearchRepository.search(queryStringQuery(query),
                dynamicExportsService.obterPageableMaximoExportacao());
            byteArrayOutputStream = dynamicExportsService.export(new RelatorioTipoEquipeColunas(), result, tipoRelatorio,
                Optional.empty(), Optional.ofNullable(AbacoUtil.REPORT_LOGO_PATH),
                Optional.ofNullable(AbacoUtil.getReportFooter()));
        } catch (DRException | ClassNotFoundException | JRException | NoClassDefFoundError e) {
            throw new RelatorioException(e);
        }

        return byteArrayOutputStream;
    }

    public List<TipoEquipe> getAll() {
        return tipoEquipeRepository.findAll();
    }

}
