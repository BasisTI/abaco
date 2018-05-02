package br.com.basis.abaco.reports.rest;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import br.com.basis.abaco.domain.Analise;
import net.sf.jasperreports.engine.JRException;

/**
 * @author eduardo.andrade
 * @since 27/04/2018
 */
@Path("/relatorio")
public class RelatorioAnaliseRest {
	
	private static String caminhoRalatorioCertificado = "/relatorios/Analise.jasper";

    @Context
    HttpServletRequest request;
    
	private Analise analise;
    
    private void init() {
    	analise = new Analise(); 
    }
	
	@GET
	@Path("/pdfAnalise/{idAnalise}")
	public Response downloadAnalise(@PathParam("idAnalise") Long idAnalise) throws IOException, JRException {
		init();
		
		RelatorioUtil relatorio = new RelatorioUtil();
		
		byte[] pdf = relatorio.gerarPdf(request, caminhoRalatorioCertificado, popularParametroAnalise());
		
		ResponseBuilder response = Response.ok((Object) pdf);
		
        response.header("Content-Disposition","attachment; Analise " + analise.getIdentificadorAnalise() + ".pdf");
        return response.build();

	}
	
	private SimpleDateFormat formatarData() {
		SimpleDateFormat dataFormatada = new SimpleDateFormat("dd/MM/yyyy");
		
		return dataFormatada;
	}
	
    /**
     * Método responsável por popular o parametro do Jasper.
     */   
    private Map<String, Object> popularParametroAnalise() {
    	Map<String, Object> parametro = new HashMap<String, Object>();
    	
    	parametro.put("PROPOSITO", analise.getPropositoContagem());
    	parametro.put("ESCOPO", analise.getEscopo());
    	parametro.put("FONTEIRA", analise.getFronteiras());
    	parametro.put("METODO_CONTAGEM", analise.getContrato().getManual().getVersaoCPM());
    	parametro.put("DOCUMENTACAO", analise.getDocumentacao());
    	parametro.put("FUNCAO_DADOS", analise.getFuncaoDados());
    	parametro.put("FUNCAO_TRANSACAO", analise.getFuncaoTransacaos());
    	parametro.put("AJUSTES", analise.getFatorAjuste());
    	parametro.put("OBSERVACOES", analise.getObservacoes());
    	
    	return parametro;
    }
    
    
    
}