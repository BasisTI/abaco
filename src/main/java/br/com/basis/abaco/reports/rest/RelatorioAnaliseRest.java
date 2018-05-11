package br.com.basis.abaco.reports.rest;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Produces;
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
    
    private static String caminhoImagem = "reports/img/fnde_logo.png";

    private HttpServletRequest request;
    
    private HttpServletResponse response;

    private Analise analise;
    
    private RelatorioUtil relatorio;

    private Map<String, Object> parametro;

    public RelatorioAnaliseRest(HttpServletResponse response, HttpServletRequest request ) {
        this.response = response;
        this.request = request;
    }
    
    /**
     * 
     */
    private void init() {
        analise = new Analise();
        relatorio = new RelatorioUtil( this.response, this.request);
    }
    
    /**
     * 
     * @param analise
     */
    private void popularObjeto(Analise analise) {
        this.analise = analise;
    }
    
    /**
     * 
     * @param analise
     * @return
     * @throws IOException
     * @throws JRException
     */
    @Produces("application/pdf")
    public Response downloadAnalisePdf(Analise analise) throws IOException, JRException {
        init();
        popularObjeto(analise);
        byte[] pdf = relatorio.gerarPdf(request, caminhoRalatorioAnalise, popularParametroAnalise());
        ResponseBuilder response = Response.ok((Object) pdf);
        response.header("Content-Disposition", "attachment; Analise " + analise.getIdentificadorAnalise() + ".pdf");
        return response.build();
    }
    
    /**
     * 
     * @param analise
     * @throws FileNotFoundException
     * @throws JRException
     */
    public void downloadAnalise(Analise analise) throws FileNotFoundException, JRException {
        init();
        popularObjeto(analise);
        relatorio.downloadPdfAnalise(analise, caminhoRalatorioAnalise, popularParametroAnalise());
    }
    
    /**
     * Método responsável por popular o parametro do Jasper.
     */
    @SuppressWarnings("static-access")
    private Map<String, Object> popularParametroAnalise() {
        parametro = new HashMap<String, Object>();
        InputStream reportStream = getClass().getClassLoader().getSystemResourceAsStream(caminhoImagem);
        popularUsuarios();
        popularFatorAjuste();
        popularDadosBasicos(reportStream);
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
    private void popularDadosBasicos(InputStream reportStream) {
        parametro.put("IMAGEMLOGO", reportStream);
        parametro.put("PFTOTAL", validarAtributosNulos(analise.getPfTotal()));
        parametro.put("PFAJUSTADO", validarAtributosNulos(analise.getAdjustPFTotal()));
        parametro.put("DATACRIADO", validarAtributosNulos(analise.getAudit().getCreatedOn().toString()));
        parametro.put("DATAALTERADO", validarAtributosNulos(analise.getAudit().getUpdatedOn().toString()));
        parametro.put("VALORAJUSTE", validarAtributosNulos(String.valueOf(analise.getValorAjuste())));
        parametro.put("GATANTIA", validarAtributosNulos(garantia()));
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
    
    /**
     * 
     */
    private void popularContrato() {
        if (validarObjetosNulos(analise.getContrato())) {
            parametro.put("CONTRATO", validarAtributosNulos(analise.getContrato().getNumeroContrato()));
            parametro.put("CONTRATODTINICIO", validarAtributosNulos(analise.getContrato().getDataInicioVigencia().toString()));
            parametro.put("CONTRATODTFIM", validarAtributosNulos(analise.getContrato().getDataFimVigencia().toString()));
            parametro.put("CONTRATOGARANTIA", validarAtributosNulos(analise.getContrato().getDiasDeGarantia().toString()));
            parametro.put("CONTRATOATIVO", validarAtributosNulos(verificarCondicao(analise.getContrato().getAtivo())));
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
        if (validarObjetosNulos(analise.getSistema())) {
            parametro.put("SISTEMASG", validarAtributosNulos(analise.getSistema().getSigla()));
            parametro.put("SISTEMANM", validarAtributosNulos(analise.getSistema().getNome()));
        }
    }

    /**
     * 
     */
    private void popularManual() {
        if (validarObjetosNulos(analise.getContrato()) && validarObjetosNulos(analise.getContrato().getManual())) {
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
     * Método responsável por formatar a data par dia/mês/ano.
     * @param data
     * @return
     */
    public String formatarData(Date data) {
        SimpleDateFormat dataFormatada = new SimpleDateFormat("dd/MM/yyyy");
        if(data != null) {
            return dataFormatada.format(data);
        } else {
            return "---";
        }
    }

    /**
     * Método responsável por verificar a condição do valor,
     * valor true = Sim, valor false = Não.
     * @param valor
     * @return
     */
    private String verificarCondicao(Boolean valor) {
        return (valor) ? "Sim" : "Não";
    }

}