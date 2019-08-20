package br.com.basis.abaco.utils;

import br.com.basis.abaco.service.exception.RelatorioException;
import br.com.basis.dynamicexports.pojo.PropriedadesRelatorio;
import br.com.basis.dynamicexports.pojo.ReportObject;
import br.com.basis.dynamicexports.service.DynamicExportsService;
import net.sf.dynamicreports.report.exception.DRException;
import net.sf.jasperreports.engine.JRException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.io.ByteArrayOutputStream;
import java.util.Optional;

public class RelatorioUtil {

    private static final Logger log = LoggerFactory.getLogger(RelatorioUtil.class);

    public static <T extends ReportObject> ByteArrayOutputStream getRelatorioBAOS(
            String tipoRelatorio,
            Pageable pageable,
            JpaRepository<T, Long> repository,
            DynamicExportsService dynamicExportsService,
            PropriedadesRelatorio propriedadesRelatorio)
    throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream;
        try {
            Page<T> result = repository.findAll(pageable);
            byteArrayOutputStream = dynamicExportsService.export(
                propriedadesRelatorio, result, tipoRelatorio, Optional.empty(), Optional.of(AbacoUtil.REPORT_LOGO_PATH),
                Optional.of(AbacoUtil.getReportFooter()));
        } catch (DRException | ClassNotFoundException | JRException | NoClassDefFoundError e) {
            log.error(e.getMessage(), e);
            throw new RelatorioException(e);
        }
        return byteArrayOutputStream;
    }
}
