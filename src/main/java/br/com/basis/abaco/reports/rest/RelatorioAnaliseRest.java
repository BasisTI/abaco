package br.com.basis.abaco.reports.rest;

import java.io.IOException;
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
	
	private static String caminhoRalatorioAnalise = "reports/analise/analise.jasper";
//	private static String caminhoImagem = "reports/analise/imagem/fnde_mec_brasil.png";
	
    @Context
    HttpServletRequest request;
    
	private Analise analise;
	
	private Map<String, Object> parametro;
    
    private void init() {
    	analise = new Analise(); 
    }
	
	@GET
	@Path("/pdfAnalise/{idAnalise}")
	public Response downloadAnalise(@PathParam("idAnalise") Long idAnalise) throws IOException, JRException {
		init();
		
		RelatorioUtil relatorio = new RelatorioUtil();
		
		byte[] pdf = relatorio.gerarPdf(request, caminhoRalatorioAnalise, popularParametroAnalise());
		
		ResponseBuilder response = Response.ok((Object) pdf);
		
        response.header("Content-Disposition","attachment; Analise " + analise.getIdentificadorAnalise() + ".pdf");
        return response.build();

	}
	
//	private SimpleDateFormat formatarData() {
//		SimpleDateFormat dataFormatada = new SimpleDateFormat("dd/MM/yyyy");
//		
//		return dataFormatada;
//	}
	
    /**
     * Método responsável por popular o parametro do Jasper.
     */   
    private Map<String, Object> popularParametroAnalise() {
    	parametro = new HashMap<String, Object>();
    	
    	parametro.put("PROPOSITO", validarNulos(analise.getPropositoContagem()));
    	parametro.put("ESCOPO", validarNulos(analise.getEscopo()));
    	parametro.put("FONTEIRA", analise.getFronteiras());
    	parametro.put("DOCUMENTACAO", analise.getDocumentacao());
    	parametro.put("FUNCAODADOS", analise.getFuncaoDados());
    	parametro.put("FUNCAOTRANSACAO", analise.getFuncaoTransacaos());
    	parametro.put("AJUSTES", analise.getFatorAjuste());
    	parametro.put("OBSERVACOES", analise.getObservacoes());

    	parametro.put("PFTOTAL", analise.getPfTotal());
    	parametro.put("PFAJUSTADO", analise.getAdjustPFTotal());
    	parametro.put("TIPOANALISE", analise.getTipoAnalise());
    	
    	parametro.put("DATACRIADO", analise.getAudit().getCreatedOn());
    	parametro.put("DATAALTERADO", analise.getAudit().getUpdatedOn());
    	parametro.put("CRIADOPOR", analise.getCreatedBy());
    	parametro.put("EDITADOPOR", analise.getEditedBy());
    	parametro.put("DATAHOMOLOGACAO", analise.getDataHomologacao());
    	parametro.put("EQUIPE", analise.getEquipeResponsavel());
    	parametro.put("NUMEROOS", analise.getNumeroOs());
    	parametro.put("VALORAJUSTE", analise.getValorAjuste());
    	parametro.put("IDENTIFICADOR", analise.getIdentificadorAnalise());
    	parametro.put("GATANTIA", garantia());
    	parametro.put("FATORAJUSTE", analise.getFatorAjuste().getNome());
    	
    	popularContrato();
    	popularSistema();
    	popularManual();
    	
    	return parametro;
    }
    
    private void popularContrato() {
    	
    	if(analise.getContrato() != null) {
        	parametro.put("CONTRATO", analise.getContrato().getNumeroContrato());
        	parametro.put("ORGANIZACAO", analise.getContrato().getOrganization().getSigla());
        	parametro.put("ORGANIZACAONM", analise.getContrato().getOrganization().getNome());
        	parametro.put("CONTRATODTINICIO", analise.getContrato().getDataInicioVigencia());
        	parametro.put("CONTRATODTFIM", analise.getContrato().getDataFimVigencia());
        	parametro.put("CONTRATOGARANTIA", analise.getContrato().getDiasDeGarantia());
        	parametro.put("CONTRATOATIVO", analise.getContrato().getAtivo());
        	parametro.put("VERSAOCPM", analise.getContrato().getManual().getVersaoCPM());
    	}
    	
    }
    
    private void popularSistema() {

    	if(analise.getSistema() != null) {
    		parametro.put("SISTEMASG", analise.getSistema().getSigla());
    		parametro.put("SISTEMANM", analise.getSistema().getNome());
    		parametro.put("SISTEMAMODULOS", analise.getSistema().getModulos());
    	}
    	
    	
    }
    
    private void popularManual() {
    	
    	if(analise.getContrato() != null && analise.getContrato().getManual() != null) {
    		parametro.put("MANUALNM", analise.getContrato().getManual().getNome());
    		parametro.put("METODOCONTAGEM", analise.getMetodoContagem());
    	}
    }
    
    private String garantia() {
    	if(analise.getBaselineImediatamente()) {
    		return "Sim";
    	} else {
    		return "Não";
    	}
    }
    
    private String validarNulos(String valor) {
    	if(valor == null) {
    		return "---";
    	} else {
    		return valor;
    	}
    }
    
    
    
}