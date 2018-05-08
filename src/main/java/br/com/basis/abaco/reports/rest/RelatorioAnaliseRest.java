package br.com.basis.abaco.reports.rest;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import br.com.basis.abaco.domain.Analise;
import net.sf.jasperreports.engine.JRException;

/**
 * @author eduardo.andrade
 * @since 27/04/2018
 */
public class RelatorioAnaliseRest {

    private static String caminhoRalatorioAnalise = "reports/analise/analise.jasper";

    @Context
    HttpServletRequest request;

    private Analise analise;

    private Map<String, Object> parametro;

    private void init() {
        analise = new Analise();
    }
    
    private void popularObjeto(Analise analise) {
        this.analise = analise;
        
    }
    
    @Produces("application/pdf")
    public Response downloadAnalise(Analise analise) throws IOException, JRException {
        init();
        popularObjeto(analise);
        RelatorioUtil relatorio = new RelatorioUtil();
        byte[] pdf = relatorio.gerarPdf(request, caminhoRalatorioAnalise, popularParametroAnalise());
        ResponseBuilder response = Response.ok((Object) pdf);
        response.header("Content-Disposition", "attachment; Analise " + analise.getIdentificadorAnalise() + ".pdf");
        return response.build();

    }

    /**
     * Método responsável por popular o parametro do Jasper.
    */
    private Map<String, Object> popularParametroAnalise() {
        parametro = new HashMap<String, Object>();
        
        parametro.put("PFTOTAL", validarAtributosNulos(analise.getPfTotal()));
        parametro.put("PFAJUSTADO", validarAtributosNulos(analise.getAdjustPFTotal()));
        parametro.put("DATACRIADO", validarAtributosNulos(analise.getAudit().getCreatedOn().toString()));
        parametro.put("DATAALTERADO", validarAtributosNulos(analise.getAudit().getUpdatedOn().toString()));
        parametro.put("VALORAJUSTE", validarAtributosNulos(String.valueOf(analise.getValorAjuste())));
        parametro.put("GATANTIA", validarAtributosNulos(garantia()));
        
        popularUsuarios();
        popularFatorAjuste();
        popularDadosBasicos();
        popularContrato();
        popularOrganizacao();
        popularSistema();
        popularManual();
        
        return parametro;
    }
    
    /**
     * 
    */
    private void popularUsuarios() {
        if(validarObjetosNulos(analise.getCreatedBy())) {
            parametro.put("CRIADOPOR", validarAtributosNulos(analise.getCreatedBy().getLogin()));            
        }
        if(validarObjetosNulos(analise.getCreatedBy())) {
            parametro.put("EDITADOPOR", validarAtributosNulos(analise.getEditedBy().getLogin()));            
        }        
    }

    /**
     * 
    */    
    private void popularFatorAjuste() {
        if(validarObjetosNulos(analise.getFatorAjuste())) {
            parametro.put("FATORAJUSTE", validarAtributosNulos(analise.getFatorAjuste().getNome()));            
        }
    }

    /**
     * 
    */
    private void popularDadosBasicos() {
        parametro.put("EQUIPE", validarAtributosNulos(analise.getEquipeResponsavel().toString()));
        parametro.put("IDENTIFICADOR", validarAtributosNulos(analise.getIdentificadorAnalise()));
        parametro.put("TIPOANALISE", validarAtributosNulos(analise.getTipoAnalise().toString()));
        parametro.put("PROPOSITO", validarAtributosNulos(analise.getPropositoContagem()));
        parametro.put("ESCOPO", validarAtributosNulos(analise.getEscopo()));
        parametro.put("FONTEIRA", validarAtributosNulos(analise.getFronteiras()));
        parametro.put("DOCUMENTACAO", validarAtributosNulos(analise.getDocumentacao()));
        parametro.put("OBSERVACOES", validarAtributosNulos(analise.getObservacoes()));
        parametro.put("DATAHOMOLOGACAO", validarAtributosNulos(formatarData(analise.getDataHomologacao())));
        parametro.put("NUMEROOS", validarAtributosNulos(analise.getNumeroOs()));
    }
    
//    private void popularListaFuncaoDados() {
//        String ders = "";
//        String alr = "";
//        String impacto = "";
//        String nome = "";
//        String tipo = "";
//        
//        if(validarObjetosNulos(analise.getFuncaoDados())) {
//            for(FuncaoDados fd : analise.getFuncaoDados()) {
//                nome = fd.getName();
//                impacto = fd.getImpacto();
//                tipo = fd.getTipo().name();
//                alr = fd.getAlr().getNome();
//                
//               for(Der der : fd.getDers()) {
//                   ders += der.getNome(); 
//               }
//                
//            }
//            parametro.put("FDNOME",nome);
//            parametro.put("FDDERS",ders);
//            parametro.put("FDIMPACTO",impacto);
//            parametro.put("FDTIPO", tipo);
//            parametro.put("FDALR", alr);
//
//        }
//    }
//    
//    private void popularListaFuncaoTransacao() {
//        if(validarObjetosNulos(analise.getFuncaoTransacaos())) {
//            parametro.put("FUNCAOTRANSACAO", validarAtributosNulos(analise.getFuncaoTransacaos().toString()));            
//        }
//    }

    /**
     * 
    */
    private void popularContrato() {

        if (analise.getContrato() != null) {
            parametro.put("CONTRATO", validarAtributosNulos(analise.getContrato().getNumeroContrato()));
            parametro.put("CONTRATODTINICIO", validarAtributosNulos(analise.getContrato().getDataInicioVigencia().toString()));
            parametro.put("CONTRATODTFIM", validarAtributosNulos(analise.getContrato().getDataFimVigencia().toString()));
            parametro.put("CONTRATOGARANTIA", validarAtributosNulos(analise.getContrato().getDiasDeGarantia().toString()));
            parametro.put("CONTRATOATIVO", validarAtributosNulos(analise.getContrato().getAtivo().toString()));
        }

    }
    
    /**
     * 
    */
    private void popularOrganizacao() {
        if(validarObjetosNulos(analise.getContrato().getOrganization())) {
            parametro.put("ORGANIZACAO", validarAtributosNulos(analise.getContrato().getOrganization().getSigla()));
            parametro.put("ORGANIZACAONM", validarAtributosNulos(analise.getContrato().getOrganization().getNome()));            
        }
        
    }

    /**
     * 
    */
    private void popularSistema() {

        if (analise.getSistema() != null) {
            parametro.put("SISTEMASG", validarAtributosNulos(analise.getSistema().getSigla()));
            parametro.put("SISTEMANM", validarAtributosNulos(analise.getSistema().getNome()));
        }

    }

    /**
     * 
    */
    private void popularManual() {

        if (analise.getContrato() != null && analise.getContrato().getManual() != null) {
            parametro.put("MANUALNM", validarAtributosNulos(analise.getContrato().getManual().getNome()));
            parametro.put("METODOCONTAGEM", validarAtributosNulos(analise.getMetodoContagem().toString()));
            parametro.put("VERSAOCPM", validarAtributosNulos(analise.getContrato().getManual().getVersaoCPM().toString()));
        }
    }

    /**
     * 
    */
    private String garantia() {
        if (analise.getBaselineImediatamente()) {
            return "Sim";
        } else {
            return "Não";
        }
    }

    /**
     * 
    */
    private String validarAtributosNulos(String valor) {
        if (valor == null) {
            return "---";
        } else {
            return valor;
        }
    }
    
    /**
     * 
    */
    private boolean validarObjetosNulos(Object objeto) {
        if(objeto == null) {
            return false;
        } else {
            return true;
        }
    }
    
    /**
     * Método responsável por formatar a data.
     * @param data
     * @return
     */
    public String formatarData(Date data) {
        SimpleDateFormat dataFormatada = new SimpleDateFormat("dd/MM/yyyy");
        if(data != null) {
            return dataFormatada.format(data);
        } else {
            return null;
        }
    }

}