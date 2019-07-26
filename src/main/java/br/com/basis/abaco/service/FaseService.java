package br.com.basis.abaco.service;

import br.com.basis.abaco.domain.Fase;
import br.com.basis.abaco.repository.FaseRepository;
import br.com.basis.abaco.repository.search.FaseSearchRepository;
import br.com.basis.abaco.service.dto.FaseDTO;
import br.com.basis.abaco.service.exception.RelatorioException;
import br.com.basis.abaco.service.mapper.FaseMapper;
import br.com.basis.abaco.service.relatorio.RelatorioFaseColunas;
import br.com.basis.abaco.utils.AbacoUtil;
import br.com.basis.abaco.web.rest.errors.CustomParameterizedException;
import br.com.basis.abaco.web.rest.errors.ErrorConstants;
import br.com.basis.dynamicexports.service.DynamicExportsService;
import net.sf.dynamicreports.report.exception.DRException;
import net.sf.jasperreports.engine.JRException;
import org.elasticsearch.index.query.QueryStringQueryBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.multiMatchQuery;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

@Service
@Transactional
public class FaseService {

    private final Logger log = LoggerFactory.getLogger(FaseService.class);

    private final FaseRepository faseRepository;

    private final DynamicExportsService dynamicExportsService;

    private final EsforcoFaseService esforcoFaseService;

    private final FaseMapper faseMapper;

    public FaseService(FaseRepository faseRepository
        , FaseSearchRepository faseSearchRepository
        , DynamicExportsService dynamicExportsService
        , EsforcoFaseService esforcoFaseService
        , FaseMapper faseMapper) {
        this.faseRepository = faseRepository;
        this.dynamicExportsService = dynamicExportsService;
        this.esforcoFaseService = esforcoFaseService;
        this.faseMapper = faseMapper;
    }

    public FaseDTO save(FaseDTO faseDTO) {
        Fase fase = faseMapper.toEntity(faseDTO);
        if(faseRepository.existsByNome(fase.getNome())) {
            throw new CustomParameterizedException(ErrorConstants.FASE_CADASTRADA);
        }
        Fase result = faseRepository.save(fase);
        return faseMapper.toDto(result);
    }

    public List<FaseDTO> getFasesDTO() {
        return faseRepository.getFasesDTO();
    }

    public void delete(Long id) {
        if(esforcoFaseService.existFase(id)) {
            throw new CustomParameterizedException(ErrorConstants.FASE_EM_USO);
        }
        faseRepository.delete(id);
    }

    public Page<FaseDTO> getFases(QueryStringQueryBuilder query, Pageable newPageable) {
        Page<Fase> search = faseRepository.findAll(query, newPageable);
        return search.map(faseMapper::toDto);
    }

    public ByteArrayOutputStream getRelatorioBAOS(String tipoRelatorio, String query) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream;
        try {
            new NativeSearchQueryBuilder().withQuery(multiMatchQuery(query)).build();
            Page<Fase> result =  faseSearchRepository.search(queryStringQuery(query), dynamicExportsService.obterPageableMaximoExportacao());
            byteArrayOutputStream = dynamicExportsService.export(
                new RelatorioFaseColunas(), result, tipoRelatorio, Optional.empty(), Optional.ofNullable(AbacoUtil.REPORT_LOGO_PATH),
                Optional.ofNullable(AbacoUtil.getReportFooter()));
        } catch (DRException | ClassNotFoundException | JRException | NoClassDefFoundError e) {
            log.error(e.getMessage(), e);
            throw new RelatorioException(e);
        }
        return byteArrayOutputStream;
    }

    public FaseDTO getFaseDTO(Long id) {
        Fase one = faseRepository.findOne(id);
        return faseMapper.toDto(one);
    }

}
