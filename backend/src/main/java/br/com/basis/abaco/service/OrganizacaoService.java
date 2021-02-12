package br.com.basis.abaco.service;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Optional;

import br.com.basis.abaco.domain.Organizacao;
import br.com.basis.abaco.repository.search.OrganizacaoSearchRepository;
import br.com.basis.abaco.service.exception.RelatorioException;
import br.com.basis.abaco.service.relatorio.RelatorioOrganizacaoColunas;
import br.com.basis.abaco.utils.AbacoUtil;
import br.com.basis.dynamicexports.service.DynamicExportsService;
import net.sf.dynamicreports.report.exception.DRException;
import net.sf.jasperreports.engine.JRException;
import org.springframework.data.domain.Page;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.basis.abaco.repository.OrganizacaoRepository;
import br.com.basis.abaco.security.SecurityUtils;
import br.com.basis.abaco.service.dto.DropdownDTO;
import br.com.basis.abaco.service.dto.OrganizacaoDropdownDTO;

import static org.elasticsearch.index.query.QueryBuilders.multiMatchQuery;

@Service
@Transactional
public class OrganizacaoService {

    private final OrganizacaoRepository organizacaoRepository;

    private final OrganizacaoSearchRepository organizacaoSearchRepository;

    private final DynamicExportsService dynamicExportsService;

    public OrganizacaoService(OrganizacaoRepository organizacaoRepository, OrganizacaoSearchRepository organizacaoSearchRepository, DynamicExportsService dynamicExportsService) {
        this.organizacaoRepository = organizacaoRepository;
        this.organizacaoSearchRepository = organizacaoSearchRepository;
        this.dynamicExportsService = dynamicExportsService;
    }

    @Transactional(readOnly = true)
    public List<OrganizacaoDropdownDTO> getOrganizacaoDropdown() {
        return organizacaoRepository.getOrganizacaoDropdown();
    }

    @Transactional(readOnly = true)
    public List<OrganizacaoDropdownDTO> getOrganizacaoDropdownAtivo() {
        return organizacaoRepository.getOrganizacaoDropdownAtivo();
    }

    @Transactional(readOnly = true)
    public List<DropdownDTO> findActiveUserOrganizations() {
        return organizacaoRepository.findActiveUserOrganizations(SecurityUtils.getCurrentUserLogin());
    }

    public ByteArrayOutputStream gerarRelatorio(String query, String tipoRelatorio) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream;
        try {
            new NativeSearchQueryBuilder().withQuery(multiMatchQuery(query)).build();
            Page<Organizacao> result = organizacaoSearchRepository.findAll(dynamicExportsService.obterPageableMaximoExportacao());
            byteArrayOutputStream = dynamicExportsService.export(new RelatorioOrganizacaoColunas(), result, tipoRelatorio, Optional.empty(), Optional.ofNullable(AbacoUtil.REPORT_LOGO_PATH), Optional.ofNullable(AbacoUtil.getReportFooter()));
        } catch (DRException | ClassNotFoundException | JRException | NoClassDefFoundError e) {
            throw new RelatorioException(e);
        }
        return byteArrayOutputStream;
    }
}
