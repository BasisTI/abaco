package br.com.basis.abaco.reports.rest;

import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ResponseBody;

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
    public ResponseEntity<byte[]> downloadPdfArquivo(Analise analise, String caminhoJasperResolucao, String nomeArquivo, Map parametrosJasper) throws FileNotFoundException, JRException {
        
        File jasperFile = new File(getClass().getClassLoader().getResource(caminhoJasperResolucao).getFile());
        JasperPrint jasperPrint = (JasperPrint) JasperFillManager.fillReport(new FileInputStream(jasperFile), parametrosJasper, new JREmptyDataSource());
        
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.set(HttpHeaders.CONTENT_DISPOSITION, String.format("attachment; filename=\"%s.pdf\"", nomeArquivo));
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
    public @ResponseBody byte[] downloadPdfBrowser(Analise analise, String caminhoJasperResolucao, String nomeArquivo,  Map parametrosJasper, List<FuncoesDTO> listFuncoes) throws FileNotFoundException, JRException {
        
        File jasperFile = new File(getClass().getClassLoader().getResource(caminhoJasperResolucao).getFile());
        
        JRBeanCollectionDataSource funcoes = new JRBeanCollectionDataSource(listFuncoes);
        JasperPrint jasperPrint = (JasperPrint) JasperFillManager.fillReport(new FileInputStream(jasperFile), parametrosJasper, funcoes);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

        response.setContentType("application/x-pdf");
        response.setHeader("Content-Disposition", "inline; filename=" + nomeArquivo + ".pdf");
        return  JasperExportManager.exportReportToPdf(jasperPrint);
    }
    
    /**
     * 
     * @param nomeArquivoCSV
     * @param cabecalho
     * @param conteudo
     * @return
     * @throws IOException
     */
    public byte[] gerarRelatorioCSV(String nomeArquivoCSV, String cabecalho, String conteudo) throws IOException {
        FileOutputStream arquivo = new FileOutputStream(new File(nomeArquivoCSV));
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        baos.writeTo(arquivo);
        BufferedWriter file = new BufferedWriter(new OutputStreamWriter(baos));
        file.append(cabecalho);
        file.append(conteudo);
        file.close();
        arquivo.close();
        return baos.toByteArray();
    }

}
