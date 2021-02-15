package br.com.basis.abaco.service;

import br.com.basis.abaco.domain.Nomenclatura;
import br.com.basis.abaco.domain.User;
import br.com.basis.abaco.repository.NomenclaturaRepository;
import br.com.basis.abaco.repository.search.NomenclaturaSearchRepository;
import br.com.basis.abaco.service.dto.NomenclaturaDTO;
import br.com.basis.abaco.service.exception.RelatorioException;
import br.com.basis.abaco.service.relatorio.RelatorioNomeclaturaColunas;
import br.com.basis.abaco.service.relatorio.RelatorioOrganizacaoColunas;
import br.com.basis.abaco.service.relatorio.RelatorioUserColunas;
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
public class NomenclaturaService {

    private final NomenclaturaSearchRepository  nomenclaturaSearchRepository;
    private final NomenclaturaRepository nomenclaturaRepository;
    private final DynamicExportsService dynamicExportsService;

    public NomenclaturaService(NomenclaturaSearchRepository nomenclaturaSearchRepository, NomenclaturaRepository nomenclaturaRepository, DynamicExportsService dynamicExportsService) {
        this.nomenclaturaSearchRepository = nomenclaturaSearchRepository;
        this.nomenclaturaRepository = nomenclaturaRepository;
        this.dynamicExportsService = dynamicExportsService;
    }

    @Transactional
    public NomenclaturaDTO save(NomenclaturaDTO nomenclaturaDTO) {
        Nomenclatura nomenclatura = convertToEntity(nomenclaturaDTO);
        Nomenclatura result = nomenclaturaRepository.save(nomenclatura);
        nomenclaturaSearchRepository.save(result);
        return convertToDto(nomenclatura);
    }


    public NomenclaturaDTO convertToDto(Nomenclatura nomenclatura) {
        return new ModelMapper().map(nomenclatura, NomenclaturaDTO.class);
    }

    public Nomenclatura convertToEntity(NomenclaturaDTO nomenclaturaDTO) {
        return new ModelMapper().map(nomenclaturaDTO, Nomenclatura.class);
    }

    public Nomenclatura setEntityToElatischSearch(Nomenclatura nomenclatura){
        return convertToEntity(convertToDto(nomenclatura));
    }
    public List<NomenclaturaDTO> convert(List<Nomenclatura> lstStatus) {
        return lstStatus.stream().map(this::convertToDto)
            .collect(Collectors.toList());
    }

    public ByteArrayOutputStream gerarRelatorio(String query, String tipoRelatorio) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream;
        try {
            new NativeSearchQueryBuilder().withQuery(multiMatchQuery(query)).build();
            Page<Nomenclatura> result = nomenclaturaSearchRepository.search(queryStringQuery(query),
                dynamicExportsService.obterPageableMaximoExportacao());
            byteArrayOutputStream = dynamicExportsService.export(new RelatorioNomeclaturaColunas(), result, tipoRelatorio,
                Optional.empty(), Optional.ofNullable(AbacoUtil.REPORT_LOGO_PATH),
                Optional.ofNullable(AbacoUtil.getReportFooter()));
        } catch (DRException | ClassNotFoundException | JRException | NoClassDefFoundError e) {
            throw new RelatorioException(e);
        }

        return byteArrayOutputStream;
    }
}
