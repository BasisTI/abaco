package br.com.basis.abaco.reports.util;

import br.com.basis.abaco.domain.Analise;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.export.JRXlsExporter;
import net.sf.jasperreports.engine.export.JRXlsExporterParameter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.Map;

/**
 * @author eduardo.andrade
 * @since 27/04/2018
 */
public class RelatorioUtil {

    private HttpServletResponse response;

    private HttpServletRequest request;

    public RelatorioUtil(HttpServletResponse response, HttpServletRequest request) {
        this.response = response;
        this.request = request;
    }

    public HttpServletResponse getResponse() {
        return response;
    }

    public HttpServletRequest getRequest() {
        return request;
    }

    /**
     * Método responsável por fazer o download do PDF diretamente.
     * @param analise
     * @param caminhoJasperResolucao
     * @param parametrosJasper
     * @return
     * @throws FileNotFoundException
     * @throws JRException
     */
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public ResponseEntity<byte[]> downloadPdfArquivo(Analise analise, String caminhoJasperResolucao, Map parametrosJasper) throws FileNotFoundException, JRException {
        InputStream stram = getClass().getClassLoader().getResourceAsStream(caminhoJasperResolucao);
        JasperPrint jasperPrint = (JasperPrint) JasperFillManager.fillReport(stram, parametrosJasper, new JREmptyDataSource());
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.set(HttpHeaders.CONTENT_DISPOSITION, String.format("attachment; filename=\"%s.pdf\"", analise.getIdentificadorAnalise().trim()));
        return new ResponseEntity<byte[]>(outputStream.toByteArray(),headers, HttpStatus.OK);
    }

    /**
     * Método responsável por exibir o PDF no browser.
     * @param analise
     * @param caminhoJasperResolucao
     * @param parametrosJasper
     * @return
     * @throws FileNotFoundException
     * @throws JRException
     */
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public @ResponseBody byte[] downloadPdfBrowser(Analise analise, String caminhoJasperResolucao, Map parametrosJasper) throws FileNotFoundException, JRException {

        InputStream stram = getClass().getClassLoader().getResourceAsStream(caminhoJasperResolucao);

        JasperPrint jasperPrint = (JasperPrint)JasperFillManager.fillReport(stram, parametrosJasper, new JREmptyDataSource());

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

        response.setContentType("application/x-pdf");

        response.setHeader("Content-Disposition", "inline; filename=" + analise.getIdentificadorAnalise().trim() + ".pdf");

        return  JasperExportManager.exportReportToPdf(jasperPrint);
    }

    /**
     * Método responsável por gerar EXCEL.
     * @param analise
     * @param caminhoJasperResolucao
     * @param parametrosJasper
     * @return
     * @throws FileNotFoundException
     * @throws JRException
     */
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public @ResponseBody byte[] downloadExcel(Analise analise, String caminhoJasperResolucao, Map parametrosJasper) throws FileNotFoundException, JRException {

        InputStream stream = getClass().getClassLoader().getResourceAsStream(caminhoJasperResolucao);

        JasperPrint jasperPrint = (JasperPrint)JasperFillManager.fillReport(stream, parametrosJasper, new JREmptyDataSource());

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        JRXlsExporter exporter = new JRXlsExporter();
        exporter.setParameter(JRXlsExporterParameter.IS_REMOVE_EMPTY_SPACE_BETWEEN_ROWS, Boolean.TRUE);
        exporter.setParameter(JRXlsExporterParameter.IS_WHITE_PAGE_BACKGROUND, Boolean.FALSE);
        exporter.setParameter(JRXlsExporterParameter.IS_DETECT_CELL_TYPE, Boolean.TRUE);
        exporter.setParameter(JRExporterParameter.OUTPUT_STREAM,outputStream);
        //we set the one page per sheet parameter here
        exporter.setParameter(JRXlsExporterParameter.IS_ONE_PAGE_PER_SHEET, Boolean.FALSE);
        exporter.setParameter(JRExporterParameter.JASPER_PRINT, jasperPrint);
        exporter.setParameter(JRExporterParameter.OUTPUT_FILE_NAME, analise.getIdentificadorAnalise().concat(".xls"));
        exporter.exportReport();

        response.setContentType("application/vnd.ms-excel");

        response.setHeader("Content-Disposition", "inline; filename=" + analise.getIdentificadorAnalise().trim() + ".xls");

        byte[] file =outputStream.toByteArray();
        return file;
    }

    /**
     * Método responsável por exibir o PDF da base line no browser.
     * @param caminhoJasperResolucao
     * @param parametrosJasper
     * @return
     * @throws FileNotFoundException
     * @throws JRException
     */
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public @ResponseBody byte[] downloadPdfBaselineBrowser(String caminhoJasperResolucao, Map parametrosJasper) throws FileNotFoundException, JRException {

        InputStream stram = getClass().getClassLoader().getResourceAsStream(caminhoJasperResolucao);

        JasperPrint jasperPrint = (JasperPrint)JasperFillManager.fillReport(stram, parametrosJasper, new JREmptyDataSource());

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

        response.setContentType("application/x-pdf");

        response.setHeader("Content-Disposition", "inline; filename=" + ".pdf");

        return  JasperExportManager.exportReportToPdf(jasperPrint);
    }

}
