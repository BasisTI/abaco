package br.com.basis.abaco.service;

import java.io.ByteArrayOutputStream;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.basis.abaco.domain.novo.Fase;
import br.com.basis.abaco.repository.FaseRepository;
import br.com.basis.abaco.service.dto.FaseDTO;
import br.com.basis.abaco.service.dto.filtro.FaseFiltroDTO;
import br.com.basis.abaco.service.exception.RelatorioException;
import br.com.basis.abaco.service.mapper.FaseMapper;
import br.com.basis.abaco.service.relatorio.RelatorioFaseColunas;
import br.com.basis.abaco.utils.AbacoUtil;
import br.com.basis.abaco.web.rest.errors.CustomParameterizedException;
import br.com.basis.abaco.web.rest.errors.ErrorConstants;
import br.com.basis.dynamicexports.service.DynamicExportsService;
import lombok.RequiredArgsConstructor;
import net.sf.dynamicreports.report.exception.DRException;
import net.sf.jasperreports.engine.JRException;

@Service
@Transactional
@RequiredArgsConstructor
public class FaseService {

    private final Logger log = LoggerFactory.getLogger(FaseService.class);

    private final FaseRepository faseRepository;

    private final DynamicExportsService dynamicExportsService;

    private final EsforcoFaseService esforcoFaseService;

    private final FaseMapper faseMapper;

    public void save(FaseDTO faseDTO) {
        validaNomeFase(faseDTO);
        faseRepository.save(faseMapper.toEntity(faseDTO));
    }

    private void validaNomeFase(FaseDTO faseDTO) {
        if (faseRepository.existsByNome(faseDTO.getNome())) {
            throw new CustomParameterizedException(ErrorConstants.FASE_CADASTRADA);
        }
    }

    public void delete(Long id) {
        validaRemocao(id);
        faseRepository.delete(id);
    }

    private void validaRemocao(Long id) {
        if (esforcoFaseService.existFase(id)) {
            throw new CustomParameterizedException(ErrorConstants.FASE_EM_USO);
        }
    }

    public Page<FaseDTO> getFases(FaseFiltroDTO filter, Pageable page) {
        ExampleMatcher caseInsensitiveExampleMatcher = ExampleMatcher.matchingAll().withIgnoreCase();
        Example<Fase> example = Example.of(faseMapper.toEntity(filter), caseInsensitiveExampleMatcher);
        Page<Fase> search = faseRepository.findAll(example, page);
        return search.map(faseMapper::toDto);
    }

    public ByteArrayOutputStream getRelatorioBAOS(String tipoRelatorio, Pageable pageable) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream;
        try {
            Page<Fase> result =  faseRepository.findAll(pageable);
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
        return faseMapper.toDto(faseRepository.findOne(id));
    }

}
