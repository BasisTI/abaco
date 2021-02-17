package br.com.basis.abaco.service;

import br.com.basis.abaco.domain.Status;
import br.com.basis.abaco.repository.StatusRepository;
import br.com.basis.abaco.repository.search.StatusSearchRepository;
import br.com.basis.abaco.service.dto.StatusDTO;
import br.com.basis.abaco.service.exception.RelatorioException;
import br.com.basis.abaco.service.relatorio.RelatorioStatusColunas;
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
public class StatusService {

    private final StatusRepository statusRepository;
    private final StatusSearchRepository statusSearchRepository;
    private final DynamicExportsService dynamicExportsService;

    public StatusService(StatusRepository statusRepository, StatusSearchRepository statusSearchRepository, DynamicExportsService dynamicExportsService) {
        this.statusRepository = statusRepository;
        this.statusSearchRepository = statusSearchRepository;
        this.dynamicExportsService = dynamicExportsService;
    }

    @Transactional(readOnly = true)
    public List<br.com.basis.abaco.service.dto.DropdownDTO> getStatusDropdown() {
        return statusRepository.getDropdown();
    }
    @Transactional
    public StatusDTO save(StatusDTO statusDTO) {
        Status status = convertToEntity(statusDTO);
        Status result = statusRepository.save(status);
        statusSearchRepository.save(result);
        return convertToDto(status);
    }

    public List<Status> findAllActive() {
        return statusRepository.findByAtivoTrue();
    }
    public List<Status> findAll() {
        return statusRepository.findAll();
    }
    public StatusDTO convertToDto(Status status) {
        return new ModelMapper().map(status, StatusDTO.class);
    }
    public Status convertToEntity(StatusDTO statusDTO) {
        return new ModelMapper().map(statusDTO, Status.class);
    }
    public Status setEntityToElatischSearch(Status status){
        return convertToEntity(convertToDto(status));
    }
    public List<StatusDTO> convert(List<Status> lstStatus) {
        return lstStatus.stream().map(this::convertToDto)
            .collect(Collectors.toList());
    }

    public ByteArrayOutputStream gerarRelatorio(String query, String tipoRelatorio) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream;
        try {
            new NativeSearchQueryBuilder().withQuery(multiMatchQuery(query)).build();
            Page<Status> result = statusSearchRepository.search(queryStringQuery(query),
                dynamicExportsService.obterPageableMaximoExportacao());
            byteArrayOutputStream = dynamicExportsService.export(new RelatorioStatusColunas(), result, tipoRelatorio,
                Optional.empty(), Optional.ofNullable(AbacoUtil.REPORT_LOGO_PATH),
                Optional.ofNullable(AbacoUtil.getReportFooter()));
        } catch (DRException | ClassNotFoundException | JRException | NoClassDefFoundError e) {
            throw new RelatorioException(e);
        }

        return byteArrayOutputStream;
    }
}
