package br.com.basis.abaco.utils;

import br.com.basis.abaco.web.rest.errors.CustomParameterizedException;
import br.com.basis.abaco.web.rest.errors.ErrorConstants;
import br.com.basis.dynamicexports.pojo.PropriedadesRelatorio;
import br.com.basis.dynamicexports.pojo.ReportObject;
import br.com.basis.dynamicexports.service.DynamicExportsService;
import net.sf.dynamicreports.report.exception.DRException;
import net.sf.jasperreports.engine.JRException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;

import java.io.ByteArrayOutputStream;
import java.util.Optional;

public class RelatorioUtil {
    
    private static final Logger log = LoggerFactory.getLogger(RelatorioUtil.class);

    public static <T extends ReportObject> ByteArrayOutputStream getRelatorioBAOS(
            String tipoRelatorio,
            Page<T> result,
            DynamicExportsService dynamicExportsService,
            PropriedadesRelatorio propriedadesRelatorio) {
        ByteArrayOutputStream byteArrayOutputStream;
        try {
            byteArrayOutputStream = dynamicExportsService.export(
                propriedadesRelatorio, result, tipoRelatorio, Optional.empty(), Optional.of(AbacoUtil.REPORT_LOGO_PATH),
                Optional.of(AbacoUtil.getReportFooter()));
        } catch (DRException | ClassNotFoundException | JRException | NoClassDefFoundError e) {
            log.error(e.getMessage(), e);
            throw new CustomParameterizedException(ErrorConstants.ERROR_RELATORIO);
        }
        return byteArrayOutputStream;
    }
}
