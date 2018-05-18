package br.com.basis.abaco.reports.rest;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import br.com.basis.abaco.domain.Analise;
import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;

/**
 * @author eduardo.andrade
 * @since 27/04/2018
 */
public class RelatorioUtil {

    private HttpServletResponse response;

    public HttpServletRequest request;

    public RelatorioUtil() {
    }
    
    public RelatorioUtil(HttpServletResponse response, HttpServletRequest request) {
        this.response = response;
        this.request = request;
    }

    public HttpServletResponse getResponse() {
        return response;
    }

    /**
     * 
     * @param request
     * @param caminhoJasperResolucao
     * @param parametrosJasper
     * @return
     * @throws IOException
     * @throws JRException 
     */
    @Deprecated
    @SuppressWarnings({ "rawtypes", "unchecked", "static-access" })
    public byte[] gerarPdf(HttpServletRequest request, String caminhoJasperResolucao, Map parametrosJasper) throws IOException, JRException {
        InputStream reportStream = getClass().getClassLoader().getSystemResourceAsStream(caminhoJasperResolucao);
        JasperPrint print = JasperFillManager.fillReport(reportStream, parametrosJasper, new JREmptyDataSource());
        File pdf = File.createTempFile("output.", ".pdf");
        JasperExportManager.exportReportToPdfStream(print, new FileOutputStream(pdf));
        return JasperExportManager.exportReportToPdf(print);
    }
    
    /**
     * 
     * @param analise
     * @param caminhoJasperResolucao
     * @param parametrosJasper
     * @return
     * @throws FileNotFoundException
     * @throws JRException
     */
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public ResponseEntity<byte[]> downloadPdfAnalise(Analise analise, String caminhoJasperResolucao, Map parametrosJasper) throws FileNotFoundException, JRException {
        File jasperFile = new File(getClass().getClassLoader().getResource(caminhoJasperResolucao).getFile());
        JasperPrint jasperPrint = (JasperPrint) JasperFillManager.fillReport(new FileInputStream(jasperFile), parametrosJasper, new JREmptyDataSource());
        
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("", analise.getIdentificadorAnalise());
        ResponseEntity<byte[]> response = new ResponseEntity<byte[]>(outputStream.toByteArray(),headers, HttpStatus.OK);
        return response;
    }

}
