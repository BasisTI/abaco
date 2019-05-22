package br.com.basis.abaco.reports.util;

import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.reports.util.itextutils.ReportFactory;
import br.com.basis.dynamicexports.util.DynamicExporter;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.AreaBreak;
import com.itextpdf.layout.property.TextAlignment;
import lombok.NonNull;
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
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.constraints.NotNull;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.util.HashMap;
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

    private static final String CONTAGEM_PDF = "analise_contagem.pdf";

    private static final String VERSION_CONTAGEM = "versão: 1.0";

    private HttpServletResponse response;

    private HttpServletRequest request;

    private ByteArrayOutputStream byteArray;

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
    public ResponseEntity<byte[]> downloadPdfArquivo(Analise analise, String caminhoJasperResolucao, Map params ,JRBeanCollectionDataSource dataSource) throws FileNotFoundException, JRException {
        InputStream stram = getClass().getClassLoader().getResourceAsStream(caminhoJasperResolucao);
        JasperPrint jasperPrint = (JasperPrint) JasperFillManager.fillReport(stram, params, dataSource);
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
        return buildPDFBrowser(caminhoJasperResolucao, parametrosJasper, null);
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

        return buildPDFBrowser(caminhoJasperResolucao, new HashMap(), dataSource);
    }

    private byte[] buildPDFBrowser(String caminhoJasperResolucao, Map parametters, JRBeanCollectionDataSource dataSource) throws JRException {
        InputStream stream = getClass().getClassLoader().getResourceAsStream(caminhoJasperResolucao);

        JasperPrint jasperPrint = (JasperPrint) JasperFillManager.fillReport(stream, parametters, dataSource);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        JRPdfExporter exporter = new JRPdfExporter();
        exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(outputStream));
        exporter.setExporterInput(new SimpleExporterInput(jasperPrint));


        SimplePdfReportConfiguration configuration = new SimplePdfReportConfiguration();
        exporter.setConfiguration(configuration);

        exporter.exportReport();

        JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

        response.setContentType("application/x-pdf");

        response.setHeader(CONTENT_DISP, INLINE_FILENAME + ".pdf");

        return  JasperExportManager.exportReportToPdf(jasperPrint);
    }


    public ResponseEntity<InputStreamResource> buildReport(Analise analise) throws IOException {
        Document document = buildDocument();
        ReportFactory factory = new ReportFactory();
        document.setMargins(factory.getTopMargin(), factory.getRightMargin(), factory.getBottomMargin(), factory.getLeftMargin());
        buildHeader(document, factory);
        buildBodyAnaliseDetail(analise, document, factory);

        document.close();
        return DynamicExporter.output(byteArray, CONTAGEM_PDF);
    }

    /**
     * Cria o corpo do relatório de contagem
     * @param analise analise a serdetalhada
     * @param document documento base dor elatório
     * @param factory classe cosntrutora auxiliar do relatório
     */
    private void buildBodyAnaliseDetail(@NotNull Analise analise, @NotNull Document document, @NotNull ReportFactory factory) {
        document.add(factory.makeSubTitle("Identificação da Análise", TextAlignment.LEFT, 14F));
        document.add(factory.makeEspaco());
        buildAnaliseDetail(document, analise, factory);
    }

    private void buildAnaliseDetail(Document document, Analise analise, ReportFactory factory) {
        document.add(factory.makeTableLine("Organização", analise.getOrganizacao().getNome()));
        document.add(factory.makeTableLine("Sistema", analise.getSistema().getNome()));
        document.add(factory.makeTableLine("Identificador", analise.getIdentificadorAnalise()));
        document.add(factory.makeTableLine("Contrato", analise.getContrato().getNumeroContrato()));
        document.add(factory.makeTableLine("Manual", analise.getManual().getNome()));
        document.add(factory.makeTableLine("Organização", analise.getMetodoContagemString()));
    }

    /**
     * Cria o cabeçalho do relatório de contagem
     * @param document
     * @param factory
     * @throws MalformedURLException
     */
    private void buildHeader(@NotNull Document document, @NotNull ReportFactory factory) throws MalformedURLException {
        File img = new File("src/main/resources/reports/img/logobasis.png");
        document.add(factory.makeCabecalho(img, "Documento de Fundamentação de Contagem", VERSION_CONTAGEM, document));
        document.add(factory.makeEspaco());
    }

    private Document buildDocument() throws FileNotFoundException {
        byteArray = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(byteArray);
        PdfDocument pdfDocument = new PdfDocument(writer);
        pdfDocument.setDefaultPageSize(PageSize.A4);
        return new Document(pdfDocument);
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
