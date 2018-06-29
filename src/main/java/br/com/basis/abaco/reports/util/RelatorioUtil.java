package br.com.basis.abaco.reports.util;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ResponseBody;

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

    private HttpServletRequest request;

    public RelatorioUtil() {
    }
    
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
     * @param funcoes
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
        ResponseEntity<byte[]> response = new ResponseEntity<byte[]>(outputStream.toByteArray(),headers, HttpStatus.OK);
        return response;
    }

    /**
     * Método responsável por exibir o PDF no browser.
     * @param analise
     * @param caminhoJasperResolucao
     * @param parametrosJasper
     * @param funcoes
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

}
