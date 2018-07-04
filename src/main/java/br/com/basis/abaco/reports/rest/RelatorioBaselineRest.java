package br.com.basis.abaco.reports.rest;

import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.ResponseBody;

import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.reports.util.RelatorioUtil;
import br.com.basis.abaco.service.dto.BaselineDTO;
import net.sf.jasperreports.engine.JRException;

/**
 * @author eduardo.andrade
 * @since 04/07/2018
 */
public class RelatorioBaselineRest {

    private static String caminhoRelatorioBaseline = "reports/analise/baseline.jasper";
    
    private static String caminhoImagem = "reports/img/fnde_logo.png";

    private HttpServletRequest request;
    
    private HttpServletResponse response;
    
    private Map<String, Object> parametro;
    
    private RelatorioUtil relatorio;
    
    private BaselineDTO objeto;
    
    /**
     * 
     * @param response
     * @param request
     */
    public RelatorioBaselineRest(HttpServletResponse response, HttpServletRequest request) {
        this.response = response;
        this.request = request;
    }
    
    /**
     * 
     */
    private void init() {
        relatorio = new RelatorioUtil( this.response, this.request);
    }
    
    /**
     * 
     * @param listAnalise
     * @return
     * @throws FileNotFoundException
     * @throws JRException
     */
    public @ResponseBody byte[] downloadPdfBaselineBrowser(List<Analise> listAnalise) throws FileNotFoundException, JRException {
        init();
        return relatorio.downloadPdfBaselineBrowser(caminhoRelatorioBaseline, popularBaseline(listAnalise));
    }
    
    /**
     *
     * @return
     */
    private Map<String, Object> popularBaseline(List<Analise> listAnalise) {
        parametro = new HashMap<String, Object>();
        this.popularImagemRelatorio();
        this.popularListaBaseLine(listAnalise);
        return parametro;
    }
    
    /**
     * Método responsável por acessar o caminho da imagem da logo do relatório e popular o parâmetro.
    */
    private void popularImagemRelatorio() {
        InputStream reportStream = getClass().getClassLoader().getResourceAsStream(caminhoImagem);
        parametro.put("IMAGEMLOGO", reportStream);
    }

    /**
     * Método responsável por popular a lista de baseline.
     * @param listAnalise
     */
    private void popularListaBaseLine(List<Analise> listAnalise) {
        List<BaselineDTO> listBaseline = new ArrayList<>();
        Double pfTotalGeral = 0.0;
        Double pfAPagarGeral = 0.0;
        Double pfTotal = 0.0;
        Double pfAPagar = 0.0;
        
        for(Analise a : listAnalise) {
            objeto = new BaselineDTO();
            if(!objeto.getSistema().equals(a.getSistema())) {
                pfTotal = 0.0;
                pfAPagar = 0.0;
            }
            pfTotal += Double.valueOf(a.getPfTotal());
            pfAPagar += Double.valueOf(a.getAdjustPFTotal());
            objeto.setSistema(a.getSistema().getNome());
            objeto.setPfTotal(pfTotal.toString());
            objeto.setPfAPagar(pfAPagar.toString());
            objeto.setGarantia(a.getBaselineImediatamente() == true ? "Sim" : "Não");
            
            pfTotalGeral += pfTotal;
            pfAPagarGeral += pfAPagar;
            listBaseline.add(objeto);
        }
        this.popularParametroBaseline(listBaseline);
        this.popularParametroPF(pfTotalGeral, pfAPagarGeral);
    }
    
    /**
     * 
     * @param TotalGeral
     * @param aPagarGeral
     */
    private void popularParametroPF(Double TotalGeral, Double aPagarGeral) {
        parametro.put("PFTOTAL", TotalGeral);
        parametro.put("PFTOTALAPAGAR", aPagarGeral);
    }
    
    /**
     * 
     * @param listBaseline
     */
    private void popularParametroBaseline(List<BaselineDTO> listBaseline) {
        parametro.put("LISTABASELINE", listBaseline);
    }
    

}
