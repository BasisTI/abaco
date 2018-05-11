package br.com.basis.abaco.reports.rest;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.domain.FuncaoDados;
import br.com.basis.abaco.domain.FuncaoTransacao;
import br.com.basis.abaco.domain.UploadedFile;
import br.com.basis.abaco.web.rest.ReportController.DetailFunctionRecord;
import br.com.basis.abaco.web.rest.ReportController.FileRecord;
import br.com.basis.abaco.web.rest.ReportController.StringRecord;
import net.sf.jasperreports.engine.JRDataSource;
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

    public HttpServletRequest request;
    
    private DetailFunctionRecord record;

    public RelatorioUtil() {
    }
    
    private void init() {
        record = new DetailFunctionRecord();
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
     */
    @SuppressWarnings({ "rawtypes", "unchecked", "static-access" })
    public byte[] gerarPdf(HttpServletRequest request, String caminhoJasperResolucao, Map parametrosJasper) throws IOException {
        try {
            InputStream reportStream = getClass().getClassLoader().getSystemResourceAsStream(caminhoJasperResolucao);
            JasperPrint print = JasperFillManager.fillReport(reportStream, parametrosJasper, new JREmptyDataSource());
            File pdf = File.createTempFile("output.", ".pdf");
            JasperExportManager.exportReportToPdfStream(print, new FileOutputStream(pdf));
            return JasperExportManager.exportReportToPdf(print);            
        } catch(JRException j) {
          j.printStackTrace();
          return null;
        }
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
        List<DetailFunctionRecord> data = this.convertDataFunctions(analise);
        data.addAll(this.convertTranFunctions(analise));
        JRDataSource dataSource = new JRBeanCollectionDataSource(data);
        
        File jasperFile = new File(getClass().getClassLoader().getResource(caminhoJasperResolucao).getFile());
        JasperPrint jasperPrint = (JasperPrint) JasperFillManager.fillReport(new FileInputStream(jasperFile), parametrosJasper, dataSource);
        
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        ResponseEntity<byte[]> response = new ResponseEntity<byte[]>(outputStream.toByteArray(),headers, HttpStatus.OK);
        return response;
    }
    
    /**
     * 
     * @param analise
     * @return
     */
    private List<DetailFunctionRecord> convertDataFunctions(Analise analise) {
        List<DetailFunctionRecord> list = new ArrayList<>();
        for(FuncaoDados f:analise.getFuncaoDados()) {
            this.init();
            this.popularFuncaoDados(f);
            this.popularRelList(f);
            this.popularDerFdList(f);
            this.popularArquivoFd(f);


            list.add(record);
        }
        return list;
    }

    /**
     * 
     * @param analise
     * @return
     */
    private List<DetailFunctionRecord> convertTranFunctions(Analise analise) {
        List<DetailFunctionRecord> list = new ArrayList<>();
        for(FuncaoTransacao f:analise.getFuncaoTransacaos()) {
            this.init();
            this.popularFuncaoTransacao(f);
            this.popularRlr(f);
            this.popularDerFtList(f);
            this.popularArquivoFt(f);
            list.add(record);
        }
        return list;
    } 
    
    /**
     * Método responsável por popular o parâmetro da função de transação.
     * @param f
     */
    private void popularFuncaoTransacao(FuncaoTransacao f) {
        record.setName(f.getName());
        record.setModule((f.getFuncionalidade()==null)?"":f.getFuncionalidade().getModulo().getNome());
        record.setAdj_factor((f.getFatorAjuste()==null)?"":f.getFatorAjuste().getNome());
        record.setFunctionality((f.getFuncionalidade()==null)?"":f.getFuncionalidade().getNome());
        record.setClassification((f.getComplexidade()==null)?"":f.getComplexidade().toString());
        record.setSustentation((f.getSustantation()==null)?"":f.getSustantation());
        record.setType(1);
    }
    
    /**
     * Método responsável por popular o parâmetro de RLR da função de transação.
     * @param f
     */
    private void popularRlr(FuncaoTransacao f) {
        List<StringRecord> relList = new ArrayList<>();
        
        if (f.getFtrStr()!=null && !f.getFtrStr().isEmpty()){
            for(String row:f.getFtrStr().split("\n")) {
                relList.add(new StringRecord(row,1));
            }
        }

        if (relList.size()==0) {
            relList.add(new StringRecord("0",0));
        }
        record.setRlr(new JRBeanCollectionDataSource(relList));
    }
    
    /**
     * Método responsável por popular o parâmetro de DER da função de transação.
     * @param f
     */
    private void popularDerFtList(FuncaoTransacao f) {
        List<StringRecord> derList = new ArrayList<>();
        if (f.getDetStr()!=null && !f.getDetStr().isEmpty()){
            for(String row:f.getDetStr().split("\n")) {
                derList.add(new StringRecord(row,1));
            }
        }
        if (derList.size()==0) {
            derList.add(new StringRecord("0",0));
        }
        record.setDer(new JRBeanCollectionDataSource(derList));
    }
    
    /**
     * Método responsável por popular o parâmetro de arquivo da função de transação.
     * @param f
     */
    private void popularArquivoFt(FuncaoTransacao f) {
        List<FileRecord> files = new ArrayList<>();
        for(UploadedFile uploadedFile:f.getFiles()){
            FileRecord file = new FileRecord();
            file.setName(uploadedFile.getFilename());
            files.add(file);
        }
        record.setFiles(new JRBeanCollectionDataSource(files));
    }
    
    /**
     * Método responsável por popular o parâmetro da função de dados.
     * @param f
     */
    private void popularFuncaoDados(FuncaoDados f) {
        record.setName(f.getName());
        record.setModule((f.getFuncionalidade()==null)?"":f.getFuncionalidade().getModulo().getNome());
        record.setAdj_factor((f.getFatorAjuste()==null)?"":f.getFatorAjuste().getNome());
        record.setFunctionality((f.getFuncionalidade()==null)?"":f.getFuncionalidade().getNome());
        record.setClassification((f.getComplexidade()==null)?"":f.getComplexidade().toString());
        record.setSustentation((f.getSustantation()==null)?"":f.getSustantation());
        record.setType(0);
    }
    
    /**
     * Método responsável por popular o parâmetro de REL da função de dados.
     * @param f
     */
    private void popularRelList(FuncaoDados f) {
        List<StringRecord> relList = new ArrayList<>();
        if (f.getRetStr()!=null && !f.getRetStr().isEmpty()){
            for(String row:f.getRetStr().split("\n")) {
                relList.add(new StringRecord(row,0));
            }
        }
        if (relList.size()==0) {
            relList.add(new StringRecord("0",0));
        }
        record.setRlr(new JRBeanCollectionDataSource(relList));
    }
    
    /**
     * Método responsável por popular o parâmetro de DER da função de dados.
     * @param f
     */
    private void popularDerFdList(FuncaoDados f) {
        List<StringRecord> derList = new ArrayList<>();
        if (f.getDetStr()!=null && !f.getDetStr().isEmpty()){
            for(String row:f.getDetStr().split("\n")) {
                derList.add(new StringRecord(row,0));
            }
        }
        if (derList.size()==0) {
            derList.add(new StringRecord("0",0));
        }
        record.setDer(new JRBeanCollectionDataSource(derList));
    }
    
    /**
     * Método responsável por popular o parâmetro de arquivo da função de dados.
     * @param f
     */
    private void popularArquivoFd(FuncaoDados f) {
        List<FileRecord> files = new ArrayList<>();
        for(UploadedFile uploadedFile:f.getFiles()){
            FileRecord file = new FileRecord();
            file.setName(uploadedFile.getFilename());
            files.add(file);
        }
        record.setFiles(new JRBeanCollectionDataSource(files));
    }

}
