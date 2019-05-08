package br.com.basis.abaco.reports.util;

import br.com.basis.abaco.domain.Analise;
import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.engine.export.JRXlsExporter;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import net.sf.jasperreports.export.SimplePdfReportConfiguration;
import net.sf.jasperreports.export.SimpleXlsReportConfiguration;
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

    private static final String INLINE_FILENAME = "inline; filename=";

    private static final String CONTENT_DISP = "Content-Disposition";

    private static final String RAW_TYPES = "rawtypes";

    private static final String UNCHECKED = "unchecked";

    private static final String EXCEL = "application/vnd.ms-excel";

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
    @SuppressWarnings({ RAW_TYPES, UNCHECKED })
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
     * Método responsável por fazer o download do PDF diretamente.
     * @param analise
     * @param caminhoJasperResolucao
     * @param dataSource
     * @return
     * @throws FileNotFoundException
     * @throws JRException
     */
    @SuppressWarnings({ RAW_TYPES, UNCHECKED })
    public ResponseEntity<byte[]> downloadPdfArquivo(Analise analise, String caminhoJasperResolucao, JRBeanCollectionDataSource dataSource) throws FileNotFoundException, JRException {
        InputStream stram = getClass().getClassLoader().getResourceAsStream(caminhoJasperResolucao);
        JasperPrint jasperPrint = (JasperPrint) JasperFillManager.fillReport(stram, null, dataSource);
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
    @SuppressWarnings({ RAW_TYPES, UNCHECKED })
    public @ResponseBody byte[] downloadPdfBrowser(Analise analise, String caminhoJasperResolucao, Map parametrosJasper) throws FileNotFoundException, JRException {

        InputStream stream = getClass().getClassLoader().getResourceAsStream(caminhoJasperResolucao);

        JasperPrint jasperPrint = (JasperPrint)JasperFillManager.fillReport(stream, parametrosJasper, new JREmptyDataSource());

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        JRPdfExporter exporter = new JRPdfExporter();
        exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(outputStream));
        exporter.setExporterInput(new SimpleExporterInput(jasperPrint));


        SimplePdfReportConfiguration configuration = new SimplePdfReportConfiguration();
        exporter.setConfiguration(configuration);

        exporter.exportReport();

        response.setHeader(CONTENT_DISP, INLINE_FILENAME + analise.getIdentificadorAnalise().trim() + ".xls");
        response.setContentType(EXCEL);


        return outputStream.toByteArray();
    }

    /**
     * Método responsável por exibir o PDF no browser.
     * @param analise
     * @param caminhoJasperResolucao
     * @param dataSource
     * @return
     * @throws FileNotFoundException
     * @throws JRException
     */
    @SuppressWarnings({ RAW_TYPES, UNCHECKED })
    public @ResponseBody byte[] downloadPdfBrowser(Analise analise, String caminhoJasperResolucao, JRBeanCollectionDataSource dataSource) throws JRException {

        InputStream stream = getClass().getClassLoader().getResourceAsStream(caminhoJasperResolucao);

        JasperPrint jasperPrint = (JasperPrint)JasperFillManager.fillReport(stream, null, dataSource);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        JRPdfExporter exporter = new JRPdfExporter();
        exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(outputStream));
        exporter.setExporterInput(new SimpleExporterInput(jasperPrint));


        SimplePdfReportConfiguration configuration = new SimplePdfReportConfiguration();
        exporter.setConfiguration(configuration);

        exporter.exportReport();

        response.setHeader(CONTENT_DISP, INLINE_FILENAME + analise.getIdentificadorAnalise().trim() + ".xls");
        response.setContentType(EXCEL);


        return outputStream.toByteArray();
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
    @SuppressWarnings({ RAW_TYPES, UNCHECKED })
    public @ResponseBody byte[] downloadExcel(Analise analise, String caminhoJasperResolucao, Map parametrosJasper) throws FileNotFoundException, JRException {

        InputStream stream = getClass().getClassLoader().getResourceAsStream(caminhoJasperResolucao);

        JasperPrint jasperPrint = (JasperPrint)JasperFillManager.fillReport(stream, parametrosJasper, new JREmptyDataSource());

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        JRXlsExporter exporter = new JRXlsExporter();
        exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
        exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(outputStream));

        SimpleXlsReportConfiguration configuration = new SimpleXlsReportConfiguration();
        configuration.setOnePagePerSheet(false);
        configuration.setDetectCellType(true);
        configuration.setCollapseRowSpan(false);
        configuration.setWhitePageBackground(true);
        configuration.setRemoveEmptySpaceBetweenRows(true);
        configuration.setIgnoreCellBackground(true);
        exporter.setConfiguration(configuration);

        exporter.exportReport();

        response.setContentType(EXCEL);

        response.setHeader(CONTENT_DISP, INLINE_FILENAME + analise.getIdentificadorAnalise().trim() + ".xls");

        return outputStream.toByteArray();
    }

    /**
     * Método responsável por exibir o PDF da base line no browser.
     * @param caminhoJasperResolucao
     * @param parametrosJasper
     * @return
     * @throws FileNotFoundException
     * @throws JRException
     */
    @SuppressWarnings({ RAW_TYPES, UNCHECKED })
    public @ResponseBody byte[] downloadPdfBaselineBrowser(String caminhoJasperResolucao, Map parametrosJasper) throws FileNotFoundException, JRException {

        InputStream stram = getClass().getClassLoader().getResourceAsStream(caminhoJasperResolucao);

        JasperPrint jasperPrint = (JasperPrint)JasperFillManager.fillReport(stram, parametrosJasper, new JREmptyDataSource());

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

        response.setContentType("application/x-pdf");

        response.setHeader(CONTENT_DISP, INLINE_FILENAME + ".pdf");

        return  JasperExportManager.exportReportToPdf(jasperPrint);
    }

}
