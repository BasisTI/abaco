package br.com.basis.abaco.reports.util;

import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.domain.FuncaoDados;
import br.com.basis.abaco.domain.FuncaoTransacao;
import br.com.basis.abaco.domain.Funcionalidade;
import br.com.basis.abaco.domain.Modulo;
import br.com.basis.abaco.domain.enumeration.ImpactoFatorAjuste;
import br.com.basis.abaco.domain.enumeration.TipoFuncaoDados;
import br.com.basis.abaco.domain.enumeration.TipoFuncaoTransacao;
import br.com.basis.abaco.reports.util.itextutils.ReportFactory;
import br.com.basis.dynamicexports.util.DynamicExporter;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.property.TextAlignment;
import net.sf.jasperreports.engine.JRDataSource;
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
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * @author eduardo.andrade
 * @since 27/04/2018
 */
public class RelatorioUtil {

    private static final String ATTACHMENT_FILENAME_S_PDF = "attachment; filename=%s.pdf";

    private static final String INLINE_FILENAME = "inline; filename=";

    private static final String CONTENT_DISP = "Content-Disposition";

    private static final String RAW_TYPES = "rawtypes";

    private static final String UNCHECKED = "unchecked";

    private static final String EXCEL = "application/vnd.ms-excel";

    private static final String CONTAGEM_PDF = "analise_contagem.pdf";

    private static final String FUNDAMENTACAO = "Fundamentação";


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
        headers.set(HttpHeaders.CONTENT_DISPOSITION, String.format(ATTACHMENT_FILENAME_S_PDF, analise.getIdentificadorAnalise().trim()));
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
        headers.set(HttpHeaders.CONTENT_DISPOSITION, String.format(ATTACHMENT_FILENAME_S_PDF, pegarNomeRelatorio(analise)));
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
    public @ResponseBody ResponseEntity<byte[]> downloadPdfBrowser(Analise analise, String caminhoJasperResolucao, Map parametrosJasper) throws FileNotFoundException, JRException {
        return buildPDFBrowser(caminhoJasperResolucao, parametrosJasper, new JREmptyDataSource(), analise);
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
    public @ResponseBody ResponseEntity<byte[]> downloadPdfBrowser(Analise analise, String caminhoJasperResolucao, JRBeanCollectionDataSource dataSource) throws JRException {

        return buildPDFBrowser(caminhoJasperResolucao, new HashMap(), dataSource, analise);
    }

    private @ResponseBody ResponseEntity<byte[]> buildPDFBrowser(String caminhoJasperResolucao, Map parametters, JRDataSource dataSource, Analise analise) throws JRException {
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

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.set(HttpHeaders.CONTENT_DISPOSITION, String.format(ATTACHMENT_FILENAME_S_PDF, pegarNomeRelatorio(analise)));
        return new ResponseEntity<byte[]>(outputStream.toByteArray(),headers, HttpStatus.OK);
    }


    public ResponseEntity<InputStreamResource> buildReport(@NotNull Analise analise) throws IOException {
        Document document = buildDocument();
        ReportFactory factory = new ReportFactory();
        document.setMargins(factory.getTopMargin(), factory.getRightMargin(), factory.getBottomMargin(), factory.getLeftMargin());
        buildHeader(document, factory);
        buildBodyAnaliseDetail(analise, document, factory);
        document.close();
        return DynamicExporter.output(byteArray, pegarNomeRelatorio(analise));
    }

    public static String pegarNomeRelatorio(Analise analise){
        String nomeRelatorio = "";
        String[] numeroOs;
        if(analise.getNumeroOs() != null){
            numeroOs = analise.getNumeroOs().split("-");
            nomeRelatorio += numeroOs[0];
            if(numeroOs.length > 1) {
                nomeRelatorio += "_OS";
                nomeRelatorio += numeroOs[1];
            }
        }else if(analise.getIdentificadorAnalise() != null){
            numeroOs = analise.getIdentificadorAnalise().split("-");
            nomeRelatorio += numeroOs[0];
            if(numeroOs.length > 1){
                nomeRelatorio += "_OS";
                nomeRelatorio += numeroOs[1];
            }
        }else{
            nomeRelatorio += "_OS_Contagem";
        }
        return nomeRelatorio += "_Contagem";
    }

    /**
     * Cria o corpo do relatório de contagem
     * @param analise analise a serdetalhada
     * @param document documento base dor elatório
     * @param factory classe cosntrutora auxiliar do relatório
     */
    private void buildBodyAnaliseDetail(@NotNull Analise analise, @NotNull Document document, @NotNull ReportFactory factory) throws MalformedURLException {
        document.add(factory.makeSubTitle("Identificação da Demanda", TextAlignment.LEFT, 14F));
        buildAnaliseDetail(document, analise, factory);
        document.add(factory.makeEspaco());
        document.add(factory.makeSubTitle("Detalhamento da Demanda", TextAlignment.LEFT, 14F));
        buildModules(analise.getSistema().getModulos(), document, factory);
    }

    private void buildModules(Set<Modulo> modulos, Document document, ReportFactory factory) throws MalformedURLException {
        for (Modulo modulo : modulos) {
            if(verifyModulo(modulo)) {
                document.add(factory.makeSubTitleLv2(modulo.getNome().replace("\n", "").replace("\t", "").trim(), TextAlignment.LEFT, 12F));
                for (Funcionalidade funcionalidade : modulo.getFuncionalidades()) {
                    if(verifyFuncionalidade(funcionalidade)) {
                        document.add(factory.makeSubTitleLv3(funcionalidade.getNome().replace("\n", "").trim(), TextAlignment.LEFT, 12F));
                        for (FuncaoDados funcoesDado : funcionalidade.getFuncoesDados()) {
                            buildTableFD(funcoesDado, factory, document);
                        }
                        for (FuncaoTransacao funcaoTransacao : funcionalidade.getFuncoesTransacao()) {
                            buildtableFT(funcaoTransacao, factory, document);
                        }
                    }
                }
                document.add(factory.makeEspaco());
            }
        }
    }

    private boolean verifyFuncionalidade(Funcionalidade funcionalidade) {
        return funcionalidade.getFuncoesTransacao().size() > 0 || funcionalidade.getFuncoesDados().size() > 0;
    }

    private boolean verifyModulo(Modulo modulo) {
        if(modulo != null && modulo.getFuncionalidades().size() > 0){
            boolean verificador = false;
            for (Funcionalidade funcionalidade : modulo.getFuncionalidades()) {
                if(funcionalidade.getFuncoesTransacao().size() > 0 || funcionalidade.getFuncoesDados().size() > 0){
                    verificador = true;
                }
            }
            return verificador;
        }
        return false;
    }

    private void buildtableFT(FuncaoTransacao funcaoTransacao, ReportFactory factory, Document document) throws MalformedURLException {
        document.add(factory.makeTableLine("Funcionalidade/Cenário", funcaoTransacao.getName()));
        document.add(factory.makeTableLine("Tipo", translateTipo(funcaoTransacao.getTipo())));
        document.add(factory.makeTableLine("Impacto", translateFT(funcaoTransacao.getImpacto())));
        List<String>alrs = new ArrayList<>();
        List<String>ders = new ArrayList<>();
        funcaoTransacao.getAlrs().forEach(alr -> alrs.add(alr.getNome() != null ? alr.getNome() : (alr.getValor() != null ? alr.getValor().toString() : null)));
        funcaoTransacao.getDers().forEach(der -> ders.add(der.getNome() != null ? der.getNome() : (der.getValor() != null ? der.getValor().toString(): null)));
        document.add(factory.makeBulletList("Entidades Referenciadas", alrs));
        document.add(factory.makeBulletList("Campos", ders));
        document.add(factory.makeDescriptionField(FUNDAMENTACAO, funcaoTransacao.getSustantation(), TextAlignment.JUSTIFIED, 12F));
        if(funcaoTransacao.getFiles() != null && !funcaoTransacao.getFiles().isEmpty()){
            document.add(factory.makeDescriptionFieldImage(FUNDAMENTACAO, funcaoTransacao.getFiles(), TextAlignment.JUSTIFIED, 12F));
        }
        document.add(factory.makeEspaco());
    }

    private void buildTableFD(FuncaoDados funcaoDados, ReportFactory factory, Document document) throws MalformedURLException {
        document.add(factory.makeTableLine("Entidade", funcaoDados.getName()));
        document.add(factory.makeTableLine("Tipo", translateTipo(funcaoDados.getTipo())));
        document.add(factory.makeTableLine("Impacto", translateFD(funcaoDados.getImpacto())));
        List<String>rlrs = new ArrayList<>();
        List<String>ders = new ArrayList<>();
        funcaoDados.getRlrs().forEach(rlr -> rlrs.add(rlr.getNome() != null ? rlr.getNome() : (rlr.getValor() != null ? rlr.getValor().toString(): null)));
        funcaoDados.getDers().forEach(der -> ders.add(der.getNome() != null ? der.getNome() : (der.getValor() != null ? der.getValor().toString() : null)));
        document.add(factory.makeBulletList("Subentidades", rlrs));
        document.add(factory.makeBulletList("Campos", ders));
        document.add(factory.makeDescriptionField(FUNDAMENTACAO, funcaoDados.getSustantation(), TextAlignment.JUSTIFIED, 12F));
        if(funcaoDados.getFiles() != null && !funcaoDados.getFiles().isEmpty()){
            document.add(factory.makeDescriptionFieldImage(FUNDAMENTACAO, funcaoDados.getFiles(), TextAlignment.JUSTIFIED, 12F));
        }
        document.add(factory.makeEspaco());
    }

    private String translateFD(ImpactoFatorAjuste impacto) {
        if(impacto == null){
            return "";
        }
        switch (impacto){
            case INCLUSAO: return "Entidade incluída nesta demanda";
            case ALTERACAO: return "Entidade alterada nesta demanda";
            case CONVERSAO:return "Conversão ou migração de dados";
            case EXCLUSAO: return "Entidade excluída nesta demanda";
            case ITENS_NAO_MENSURAVEIS: return "Outros";
            default: return null;
        }
    }

    private String translateFT(ImpactoFatorAjuste impacto) {
        if(impacto == null){
            return "";
        }
        switch (impacto){
            case INCLUSAO: return "Funcionalidade/cenário incluído nesta demanda";
            case ALTERACAO: return "Funcionalidade/cenário alterado nesta demanda";
            case CONVERSAO:return "Conversão ou migração de dados";
            case EXCLUSAO: return "Funcionalidade/cenário excluído nesta demanda";
            case ITENS_NAO_MENSURAVEIS: return "Outros";
            default: return null;
        }
    }

    private void buildAnaliseDetail(Document document, Analise analise, ReportFactory factory) {
        document.add(factory.makeTableLine("Organização", analise.getOrganizacao().getNome()));
        document.add(factory.makeTableLine("Sistema", analise.getSistema().getNome()));
        document.add(factory.makeTableLine("Identificador", analise.getIdentificadorAnalise()));
        document.add(factory.makeTableLine("Contrato", analise.getContrato().getNumeroContrato()));
    }

    private String translateTipo(Enum tipo) {
        if(tipo instanceof TipoFuncaoDados) {
            switch ((TipoFuncaoDados)tipo) {
                case ALI:
                    return "Entidade mantida internamente pelo sistema";
                case AIE:
                    return "Entidade referenciada de outro sistema";
                case INM:
                    return "Item não mensurável / Requisito não funcional";
            }
        }
        switch ((TipoFuncaoTransacao)tipo){
            case EE: return "Funcionalidade/cenário que cria/atualiza dados no sistema";
            case CE: return "Funcionalidade/cenário que apresenta dados armazenados no sistema";
            case SE: return "Funcionalidade/cenário que apresenta dados armazenados no sistema, com derivação ou cálculo, e que pode ainda criar/atualizar dados no sistema";
            case INM: return "Item não mensurável / Requisito não funcional";
        }
        return tipo.toString();
    }

    /**
     * Cria o cabeçalho do relatório de contagem
     * @param document
     * @param factory
     * @throws MalformedURLException
     */
    private void buildHeader(@NotNull Document document, @NotNull ReportFactory factory) throws MalformedURLException {
        URL img = RelatorioUtil.class.getClassLoader().getResource("reports/img/logobasis.png");
        document.add(factory.makeCabecalho(img, "Documento de Fundamentação de Contagem", document));
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
    public @ResponseBody ResponseEntity<byte[]> downloadExcel(Analise analise, String caminhoJasperResolucao, Map<String, Object> parametrosJasper) throws FileNotFoundException, JRException {

        InputStream stream = getClass().getClassLoader().getResourceAsStream(caminhoJasperResolucao);

        JasperPrint jasperPrint = JasperFillManager.fillReport(stream, parametrosJasper, new JREmptyDataSource());

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        JRXlsExporter exporter = new JRXlsExporter();
        exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
        exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(outputStream));

        SimpleXlsReportConfiguration configuration = new SimpleXlsReportConfiguration();
        configuration.setOnePagePerSheet(true);
        configuration.setDetectCellType(true);
        configuration.setCollapseRowSpan(false);
        configuration.setWhitePageBackground(true);
        configuration.setRemoveEmptySpaceBetweenRows(true);
        configuration.setIgnoreCellBackground(true);
        exporter.setConfiguration(configuration);

        exporter.exportReport();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(EXCEL));
        headers.set(HttpHeaders.CONTENT_DISPOSITION, String.format("attachment; filename=%s.xls", pegarNomeRelatorio(analise)));
        return new ResponseEntity<byte[]>(outputStream.toByteArray(),headers, HttpStatus.OK);
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
