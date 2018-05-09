package br.com.basis.abaco.reports.rest;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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

    @SuppressWarnings({ "rawtypes", "unchecked" })
    public byte[] gerarPdf(HttpServletRequest request, String caminhoJasperResolucao, Map parametrosJasper)throws IOException {
//        JasperPrint print = null;
//        Map parametros = new HashMap();
        
        try {
            InputStream reportStream = request.getServletContext().getResourceAsStream(caminhoJasperResolucao);
            JasperPrint print = JasperFillManager.fillReport(reportStream, parametrosJasper, new JREmptyDataSource());
            File pdf = File.createTempFile("output.", ".pdf");
            JasperExportManager.exportReportToPdfStream(print, new FileOutputStream(pdf));
            return JasperExportManager.exportReportToPdf(print);            
        } catch(JRException j) {
          j.printStackTrace();
          return null;
        } catch(Exception e) {
            e.printStackTrace();
            return null;
        }
        
    }

}
