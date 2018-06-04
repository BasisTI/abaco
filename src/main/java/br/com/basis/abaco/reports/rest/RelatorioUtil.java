package br.com.basis.abaco.reports.rest;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.service.dto.FuncoesDTO;
import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

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
     * 
     * @param analise
     * @param caminhoJasperResolucao
     * @param parametrosJasper
     * @return
     * @throws FileNotFoundException
     * @throws JRException
     */
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public ResponseEntity<byte[]> downloadPdfAnalise(Analise analise, String caminhoJasperResolucao, Map parametrosJasper, List<FuncoesDTO> funcoes) throws FileNotFoundException, JRException {
        
        JRBeanCollectionDataSource funcoesDados = new JRBeanCollectionDataSource(funcoes);
        
        File jasperFile = new File(getClass().getClassLoader().getResource(caminhoJasperResolucao).getFile());
//        JasperPrint jasperPrint = (JasperPrint) JasperFillManager.fillReport(new FileInputStream(jasperFile), parametrosJasper, funcoesDados);
        JasperPrint jasperPrint = (JasperPrint) JasperFillManager.fillReport(new FileInputStream(jasperFile), parametrosJasper, new JREmptyDataSource());
        
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.set(HttpHeaders.CONTENT_DISPOSITION, String.format("attachment; filename=\"%s.pdf\"", analise.getIdentificadorAnalise().trim()));  
        ResponseEntity<byte[]> response = new ResponseEntity<byte[]>(outputStream.toByteArray(),headers, HttpStatus.OK);
        return response;
    }

}
