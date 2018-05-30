package br.com.basis.abaco.reports.rest;

import java.io.FileNotFoundException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseEntity;

import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.domain.FatorAjuste;
import br.com.basis.abaco.service.dto.FuncaoDadosDTO;
import br.com.basis.abaco.service.dto.FuncaoTransacaoDTO;
import net.sf.jasperreports.engine.JRException;

/**
 * @author eduardo.andrade
 * @since 27/04/2018
 */
public class RelatorioAnaliseRest {

    private static String caminhoRalatorioAnalise = "reports/analise/analise.jasper";
    
    private static String caminhoRelatorioFuncaoDados = "reports/analise/funcao_dados.jasper";
    
    private static String caminhoRelatorioFuncaoTransacao = "reports/analise/funcao_transacao.jasper";
    
    private static String caminhoImagem = "reports/img/fnde_logo.png";

    private HttpServletRequest request;
    
    private HttpServletResponse response;

    private Analise analise;
    
    private RelatorioUtil relatorio;

    private Map<String, Object> parametro;
    
    private RelatorioFuncaoDados relatorioFuncaoDados;
    
    private RelatorioFuncaoTransacao relatorioFuncaoTransacao;

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
        relatorioFuncaoDados = new RelatorioFuncaoDados();
        relatorioFuncaoTransacao = new RelatorioFuncaoTransacao();
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
     * @throws FileNotFoundException
     * @throws JRException
     */
    public ResponseEntity<byte[]> downloadAnalise(Analise analise) throws FileNotFoundException, JRException {
        init();
        popularObjeto(analise);
        return relatorio.downloadPdfAnalise(analise, caminhoRalatorioAnalise, popularParametroAnalise());
    }

    /**
     * Método responsável por popular o parametro do Jasper.
     */
    private Map<String, Object> popularParametroAnalise() {
        parametro = new HashMap<String, Object>();
        this.popularImagemRelatorio();
        this.popularUsuarios();
        this.popularDadosBasicos();
        this.popularSubRelatorios();
        this.popularContrato();
        this.popularOrganizacao();
        this.popularSistema();
        this.popularManual();
        this.popularFuncaoDados();
        this.popularFuncaoTransacao();
        this.popularCountsFd();
        this.popularCountsFt();
        return parametro;
    }

    /**
     * 
     */
    private void popularUsuarios() {
        if(validarObjetosNulos(analise.getCreatedBy())) {
            parametro.put("CRIADOPOR", validarAtributosNulos(analise.getCreatedBy().getLogin()));            
        }
        if(validarObjetosNulos(analise.getEditedBy())) {
            parametro.put("EDITADOPOR", validarAtributosNulos(analise.getEditedBy().getLogin()));            
        }
    }

    /**
     * 
    */
    @SuppressWarnings("static-access")
    private void popularImagemRelatorio() {
        InputStream reportStream = getClass().getClassLoader().getSystemResourceAsStream(caminhoImagem);
        parametro.put("IMAGEMLOGO", reportStream);
    }

    /**
     * 
    */
    private void popularDadosBasicos() {
        parametro.put("PFTOTAL", validarAtributosNulos(analise.getPfTotal()));
        parametro.put("PFAJUSTADO", validarAtributosNulos(analise.getAdjustPFTotal()));
        parametro.put("DATACRIADO", validarAtributosNulos(analise.getAudit().getCreatedOn().toString()));
        parametro.put("DATAALTERADO", validarAtributosNulos(analise.getAudit().getUpdatedOn().toString()));
        parametro.put("VALORAJUSTE", validarAtributosNulos(String.valueOf(analise.getValorAjuste())));
        parametro.put("GARANTIA", validarAtributosNulos(garantia()));
        parametro.put("EQUIPE", validarAtributosNulos(analise.getEquipeResponsavel().getNome()));
        parametro.put("IDENTIFICADOR", validarAtributosNulos(analise.getIdentificadorAnalise()));
        parametro.put("TIPOANALISE", validarAtributosNulos(analise.getTipoAnalise().toString()));
        parametro.put("PROPOSITO", validarAtributosNulos(analise.getPropositoContagem()));
        parametro.put("ESCOPO", validarAtributosNulos(analise.getEscopo()));
        parametro.put("FRONTEIRA", validarAtributosNulos(analise.getFronteiras()));
        parametro.put("DOCUMENTACAO", validarAtributosNulos(analise.getDocumentacao()));
        parametro.put("OBSERVACOES", validarAtributosNulos(analise.getObservacoes()));
        parametro.put("DATAHMG", validarAtributosNulos(formatarData(analise.getDataHomologacao())));
        parametro.put("NUMEROOS", validarAtributosNulos(analise.getNumeroOs()));
        parametro.put("FATORAJUSTE", verificarFatorAjuste(analise.getFatorAjuste()));
    }

    /**
     * 
    */
    @SuppressWarnings("static-access")
    private void popularSubRelatorios() {
        InputStream caminhoRelatorioFd = getClass().getClassLoader().getSystemResourceAsStream(caminhoRelatorioFuncaoDados);
        InputStream caminhoRelatorioFT = getClass().getClassLoader().getSystemResourceAsStream(caminhoRelatorioFuncaoTransacao);
        
        parametro.put("SUB_REPORTS_FUNCAO_DADOS", caminhoRelatorioFd);
        parametro.put("SUB_REPORTS_FUNCAO_TRANSACAO", caminhoRelatorioFT);
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
            parametro.put("VERSAOCPM", verificarVersaoCPM(analise.getContrato().getManual().getVersaoCPM()));
        }
    }

    /**
     * 
     */
    private List<FuncaoDadosDTO> popularFuncaoDados() {
        return relatorioFuncaoDados.prepararListaFuncaoDados(analise);
    }

    /**
     * 
     */
    private List<FuncaoTransacaoDTO> popularFuncaoTransacao() {
        return relatorioFuncaoTransacao.prepararListaFuncaoTransacao(analise);
    }

    /**
     * 
     */
    private void popularCountsFd() {
        FuncaoDadosDTO fd = relatorioFuncaoDados.recuperarCounts(analise);
        this.popularComplexidadeAli(fd);
        this.popularComplexidadeAie(fd);
        this.popularComplexidadeInm(fd);
        this.popularImpactoAli(fd);
        this.popularImpactoAie(fd);
        this.popularImpactoInm(fd);
    }

    /**
     * 
     */
    private void popularCountsFt() {
        FuncaoTransacaoDTO ft = relatorioFuncaoTransacao.recuperarCounts(analise);
        this.popularComplexidadeEe(ft);
        this.popularComplexidadeSe(ft);
        this.popularComplexidadeCe(ft);
        this.popularComplexidadeInm(ft);
        this.popularImpactoEe(ft);
        this.popularImpactoSe(ft);
        this.popularImpactoCe(ft);
        this.popularImpactoInm(ft);
    }
    
    /**
     * 
     * @param fd
     */
    private void popularComplexidadeAli(FuncaoDadosDTO fd) {
        parametro.put("ALISEM", transformarInteiro(fd.getComplexidadeDto().getAliSem()));
        parametro.put("ALIBAIXA", transformarInteiro(fd.getComplexidadeDto().getAliBaixa()));
        parametro.put("ALIMEDIA", transformarInteiro(fd.getComplexidadeDto().getAliMedia()));
        parametro.put("ALIALTA", transformarInteiro(fd.getComplexidadeDto().getAliAlta()));
        parametro.put("ALIQUANDIDADE", transformarInteiro(somaQuantidades(
                 fd.getComplexidadeDto().getAliSem()
                ,fd.getComplexidadeDto().getAliBaixa()
                ,fd.getComplexidadeDto().getAliMedia()
                ,fd.getComplexidadeDto().getAliAlta())));
        parametro.put("ALIPFTOTAL", "---");
        parametro.put("ALIPFAJUSTADO", "---");
    }

    /**
     * 
     * @param fd
     */
    private void popularComplexidadeAie(FuncaoDadosDTO fd) {
        parametro.put("AIESEM", transformarInteiro(fd.getComplexidadeDto().getAieSem()));
        parametro.put("AIEBAIXA", transformarInteiro(fd.getComplexidadeDto().getAieBaixa()));
        parametro.put("AIEMEDIA", transformarInteiro(fd.getComplexidadeDto().getAieMedia()));
        parametro.put("AIEALTA", transformarInteiro(fd.getComplexidadeDto().getAieAlta()));
        parametro.put("AIEQUANTIDADE", transformarInteiro(somaQuantidades(
                 fd.getComplexidadeDto().getAieSem()
                ,fd.getComplexidadeDto().getAieBaixa()
                ,fd.getComplexidadeDto().getAieMedia()
                ,fd.getComplexidadeDto().getAieAlta())));
        parametro.put("AIEPFTOTAL", "---");
        parametro.put("AIEPFAJUSTADO", "---");
    }

    /**
     * 
     * @param fd
     */
    private void popularComplexidadeInm(FuncaoDadosDTO fd) {
        parametro.put("INMSEM", transformarInteiro(fd.getComplexidadeDto().getInmSemFd()));
        parametro.put("INMBAIXA", transformarInteiro(fd.getComplexidadeDto().getInmBaixaFd()));
        parametro.put("INMMEDIA", transformarInteiro(fd.getComplexidadeDto().getInmMediaFd()));
        parametro.put("INMALTA", transformarInteiro(fd.getComplexidadeDto().getInmAltaFd()));
        parametro.put("INMQUANTIDADE", transformarInteiro(somaQuantidades(
                 fd.getComplexidadeDto().getInmSemFd()
                ,fd.getComplexidadeDto().getInmBaixaFd()
                ,fd.getComplexidadeDto().getInmMediaFd()
                ,fd.getComplexidadeDto().getInmAltaFd())));
        parametro.put("INMPFTOTAL", "---");
        parametro.put("INMPFAJUSTADO", "---");
    }

    /**
     * 
     * @param fd
     */
    private void popularImpactoAli(FuncaoDadosDTO fd) {
      parametro.put("ALIINCLUSAO", transformarInteiro(fd.getImpactoDto().getAliInclusao()));
      parametro.put("ALIALTERACAO", transformarInteiro(fd.getImpactoDto().getAliAlteracao()));
      parametro.put("ALIEXCLUSAO", transformarInteiro(fd.getImpactoDto().getAliExclusao()));
      parametro.put("ALICONVERSAO", transformarInteiro(fd.getImpactoDto().getAliConversao()));
    }

    /**
     * 
     * @param fd
     */
    private void popularImpactoAie(FuncaoDadosDTO fd) {
      parametro.put("AIEINCLUSAO", transformarInteiro(fd.getImpactoDto().getAieInclusao()));
      parametro.put("AIEALTERACAO", transformarInteiro(fd.getImpactoDto().getAieAlteracao()));
      parametro.put("AIEEXCLUSAO", transformarInteiro(fd.getImpactoDto().getAieExclusao()));
      parametro.put("AIECONVERSAO", transformarInteiro(fd.getImpactoDto().getAieConversao()));
    }

    /**
     * 
     * @param fd
     */
    private void popularImpactoInm(FuncaoDadosDTO fd) {
      parametro.put("INMINCLUSAO", transformarInteiro(fd.getImpactoDto().getInmInclusaoFd()));
      parametro.put("INMALTERACAO", transformarInteiro(fd.getImpactoDto().getInmAlteracaoFd()));
      parametro.put("INMEXCLUSAO", transformarInteiro(fd.getImpactoDto().getInmExclusaoFd()));
      parametro.put("INMCONVERSAO", transformarInteiro(fd.getImpactoDto().getInmConversaoFd()));
    }

    /**
     * 
     * @param ft
     */
    private void popularComplexidadeEe(FuncaoTransacaoDTO ft) {
        parametro.put("EESEM", transformarInteiro(ft.getComplexidadeDto().getEeSem()));
        parametro.put("EEBAIXA", transformarInteiro(ft.getComplexidadeDto().getEeBaixa()));
        parametro.put("EEMEDIA", transformarInteiro(ft.getComplexidadeDto().getEeMedia()));
        parametro.put("EEALTA", transformarInteiro(ft.getComplexidadeDto().getEeAlta()));
        parametro.put("EEQUANTIDADE", transformarInteiro(somaQuantidades(
                 ft.getComplexidadeDto().getEeSem()
                ,ft.getComplexidadeDto().getEeBaixa()
                ,ft.getComplexidadeDto().getEeMedia()
                ,ft.getComplexidadeDto().getEeAlta())));
        parametro.put("EEPFTOTAL", "---");
        parametro.put("EEPFAJUSTADO", "---");
    }

    /**
     * 
     * @param ft
     */
    private void popularComplexidadeSe(FuncaoTransacaoDTO ft) {
        parametro.put("SESEM", transformarInteiro(ft.getComplexidadeDto().getSeSem()));
        parametro.put("SEBAIXA", transformarInteiro(ft.getComplexidadeDto().getSeBaixa()));
        parametro.put("SEMEDIA", transformarInteiro(ft.getComplexidadeDto().getSeMedia()));
        parametro.put("SEALTA", transformarInteiro(ft.getComplexidadeDto().getSeAlta()));
        parametro.put("SEQUANTIDADE", transformarInteiro(somaQuantidades(
                 ft.getComplexidadeDto().getSeSem()
                ,ft.getComplexidadeDto().getSeBaixa()
                ,ft.getComplexidadeDto().getSeMedia()
                ,ft.getComplexidadeDto().getSeAlta())));
        parametro.put("SEPFTOTAL", "---");
        parametro.put("SEPFAJUSTADO", "---");
    }

    /**
     * 
     * @param ft
     */
    private void popularComplexidadeCe(FuncaoTransacaoDTO ft) {
        parametro.put("CESEM", transformarInteiro(ft.getComplexidadeDto().getCeSem()));
        parametro.put("CEBAIXA", transformarInteiro(ft.getComplexidadeDto().getCeBaixa()));
        parametro.put("CEMEDIA", transformarInteiro(ft.getComplexidadeDto().getCeMedia()));
        parametro.put("CEALTA", transformarInteiro(ft.getComplexidadeDto().getCeAlta()));
        parametro.put("CEQUANTIDADE", transformarInteiro(somaQuantidades(
                 ft.getComplexidadeDto().getCeSem()
                ,ft.getComplexidadeDto().getCeBaixa()
                ,ft.getComplexidadeDto().getCeMedia()
                ,ft.getComplexidadeDto().getCeAlta())));
        parametro.put("CEPFTOTAL", "---");
        parametro.put("CEPFAJUSTADO", "---");
    }

    /**
     * 
     * @param ft
     */
    private void popularComplexidadeInm(FuncaoTransacaoDTO ft) {
        parametro.put("INMFTSEM", transformarInteiro(ft.getComplexidadeDto().getInmSemFt()));
        parametro.put("INMFTBAIXA", transformarInteiro(ft.getComplexidadeDto().getInmBaixaFt()));
        parametro.put("INMFTMEDIA", transformarInteiro(ft.getComplexidadeDto().getInmMediaFt()));
        parametro.put("INMFTALTA", transformarInteiro(ft.getComplexidadeDto().getInmAltaFt()));
        parametro.put("INMFTQUANTIDADE", transformarInteiro(somaQuantidades(
                 ft.getComplexidadeDto().getInmSemFt()
                ,ft.getComplexidadeDto().getInmBaixaFt()
                ,ft.getComplexidadeDto().getInmMediaFt()
                ,ft.getComplexidadeDto().getInmAltaFt())));
        parametro.put("INMFTPFTOTAL", "---");
        parametro.put("INMFTPFAJUSTADO", "---");
    }

    /**
     * 
     * @param ft
     */
    private void popularImpactoEe(FuncaoTransacaoDTO ft) {
        parametro.put("EEINCLUSAO", transformarInteiro(ft.getImpactoDto().getEeInclusao()));
        parametro.put("EEALTERACAO", transformarInteiro(ft.getImpactoDto().getEeAlteracao()));
        parametro.put("EEEXCLUSAO", transformarInteiro(ft.getImpactoDto().getEeExclusao()));
        parametro.put("EECONVERSAO", transformarInteiro(ft.getImpactoDto().getEeConversao()));
    }

    /**
     * 
     * @param ft
     */
    private void popularImpactoSe(FuncaoTransacaoDTO ft) {
        parametro.put("SEINCLUSAO", transformarInteiro(ft.getImpactoDto().getSeInclusao()));
        parametro.put("SEALTERACAO", transformarInteiro(ft.getImpactoDto().getSeAlteracao()));
        parametro.put("SEEXCLUSAO", transformarInteiro(ft.getImpactoDto().getSeExclusao()));
        parametro.put("SECONVERSAO", transformarInteiro(ft.getImpactoDto().getSeConversao()));
    }

    /**
     * 
     * @param ft
     */
    private void popularImpactoCe(FuncaoTransacaoDTO ft) {
        parametro.put("CEINCLUSAO", transformarInteiro(ft.getImpactoDto().getCeInclusao()));
        parametro.put("CEALTERACAO", transformarInteiro(ft.getImpactoDto().getCeAlteracao()));
        parametro.put("CEEXCLUSAO", transformarInteiro(ft.getImpactoDto().getCeExclusao()));
        parametro.put("CECONVERSAO", transformarInteiro(ft.getImpactoDto().getCeConversao()));
    }

    /**
     * 
     * @param ft
     */
    private void popularImpactoInm(FuncaoTransacaoDTO ft) {
        parametro.put("INMFTINCLUSAO", transformarInteiro(ft.getImpactoDto().getInmInclusaoFt()));
        parametro.put("INMFTALTERACAO", transformarInteiro(ft.getImpactoDto().getInmAlteracaoFt()));
        parametro.put("INMFTEXCLUSAO", transformarInteiro(ft.getImpactoDto().getInmExclusaoFt()));
        parametro.put("INMFTCONVERSAO", transformarInteiro(ft.getImpactoDto().getInmConversaoFt()));
    }

    /**
     * 
     * @param ft
     */
    private Integer somaQuantidades(Integer sem, Integer baixa, Integer media, Integer alta) {
        if(sem == null) {
            sem = 0;
        }
        if(baixa == null ) {
            baixa = 0;
        }
        if(media == null) {
            media = 0;
        }
        if(alta == null) {
            alta = 0;
        }
        return sem + baixa + media + alta;
    }

    /**
     * 
     */
    private String verificarFatorAjuste(FatorAjuste valor) {
        if(valor == null) {
            return "Nenhum";
        } else {
            return valor.getNome();
        }
    }

    /**
     * 
     */
    private String verificarVersaoCPM(Long valor) {
        if(valor == 431) {
            return "4.3.1";
        }
        if(valor == 421) {
            return "4.2.1";
        }
        return "---";
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
     * Método responsável por validar se o atributo é nulo,
     * se ele for nulo é incluído o valor ---.
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
        return objeto == null ? false : true;
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
    
    private String transformarInteiro(Integer valor) {
        if(valor == null) {
            valor = 0;
        }
        return valor.toString();
    }

}