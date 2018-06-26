package br.com.basis.abaco.reports.rest;

import java.io.FileNotFoundException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ResponseBody;

import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.domain.FatorAjuste;
import br.com.basis.abaco.service.dto.FuncoesDTO;
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
    
    private RelatorioFuncoes relatorioFuncoes;
    
    private List<FuncoesDTO> listFuncoes;

    public RelatorioAnaliseRest(HttpServletResponse response, HttpServletRequest request ) {
        this.response = response;
        this.request = request;
    }

    /**
     * 
     */
    private void init() {
        listFuncoes = new ArrayList<FuncoesDTO>();
        analise = new Analise();
        relatorio = new RelatorioUtil( this.response, this.request);
        relatorioFuncoes = new RelatorioFuncoes();
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
        return relatorio.downloadPdfArquivo(analise, caminhoRalatorioAnalise, analise.getIdentificadorAnalise().trim(),popularParametroAnalise());
    }
    
    /**
     * 
     * @param analise
     * @throws FileNotFoundException
     * @throws JRException
     */
    public @ResponseBody byte[] downloadAnalisePDF(Analise analise) throws FileNotFoundException, JRException {
        init();
        popularObjeto(analise);
        return relatorio.downloadPdfBrowser(analise, caminhoRalatorioAnalise, analise.getIdentificadorAnalise().trim(), popularParametroAnalise(), listFuncoes);
    }

    /**
     * Método responsável por popular o parametro do Jasper.
     */
    private Map<String, Object> popularParametroAnalise() {
        parametro = new HashMap<String, Object>();
        this.popularImagemRelatorio();
        this.popularUsuarios();
        this.popularDadosBasicos();
        this.popularContrato();
        this.popularOrganizacao();
        this.popularSistema();
        this.popularManual();
        this.popularFuncao();
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
        parametro.put("AJUSTESPF", calcularPFsAjustado(analise.getPfTotal(), analise.getAdjustPFTotal()));
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
    
    private void popularFuncao() {
        for (FuncoesDTO funcoesDTO : relatorioFuncoes.prepararListaFuncoes(analise)) {
            listFuncoes.add(funcoesDTO);
        }
    }

    /**
     * 
     */
    private void popularCountsFd() {
        FuncoesDTO fd = relatorioFuncoes.recuperarCountsFd(analise);
        this.popularComplexidadeAli(fd);
        this.popularComplexidadeAie(fd);
        this.popularComplexidadeInmFd(fd);
        this.popularImpactoAli(fd);
        this.popularImpactoAie(fd);
        this.popularImpactoInmFd(fd);
    }

    /**
     * 
     */
    private void popularCountsFt() {
        FuncoesDTO ft = relatorioFuncoes.recuperarCountsFt(analise);
        this.popularComplexidadeEe(ft);
        this.popularComplexidadeSe(ft);
        this.popularComplexidadeCe(ft);
        this.popularComplexidadeInmFt(ft);
        this.popularImpactoEe(ft);
        this.popularImpactoSe(ft);
        this.popularImpactoCe(ft);
        this.popularImpactoInmFt(ft);
    }
    
    /**
     * 
     * @param fd
     */
    private void popularComplexidadeAli(FuncoesDTO fd) {
        parametro.put("ALISEM", transformarInteiro(fd.getComplexidadeDtoFd().getAliSem()));
        parametro.put("ALIBAIXA", transformarInteiro(fd.getComplexidadeDtoFd().getAliBaixa()));
        parametro.put("ALIMEDIA", transformarInteiro(fd.getComplexidadeDtoFd().getAliMedia()));
        parametro.put("ALIALTA", transformarInteiro(fd.getComplexidadeDtoFd().getAliAlta()));
        parametro.put("ALIQUANDIDADE", transformarInteiro(somaQuantidades(
                 fd.getComplexidadeDtoFd().getAliSem()
                ,fd.getComplexidadeDtoFd().getAliBaixa()
                ,fd.getComplexidadeDtoFd().getAliMedia()
                ,fd.getComplexidadeDtoFd().getAliAlta())));
        parametro.put("ALIPFTOTAL", transformarBigDecimal(fd.getComplexidadeDtoFd().getPfTotalAli()));
        parametro.put("ALIPFAJUSTADO", transformarBigDecimal(fd.getComplexidadeDtoFd().getPfAjustadoAli()));
    }

    /**
     * 
     * @param fd
     */
    private void popularComplexidadeAie(FuncoesDTO fd) {
        parametro.put("AIESEM", transformarInteiro(fd.getComplexidadeDtoFd().getAieSem()));
        parametro.put("AIEBAIXA", transformarInteiro(fd.getComplexidadeDtoFd().getAieBaixa()));
        parametro.put("AIEMEDIA", transformarInteiro(fd.getComplexidadeDtoFd().getAieMedia()));
        parametro.put("AIEALTA", transformarInteiro(fd.getComplexidadeDtoFd().getAieAlta()));
        parametro.put("AIEQUANTIDADE", transformarInteiro(somaQuantidades(
                 fd.getComplexidadeDtoFd().getAieSem()
                ,fd.getComplexidadeDtoFd().getAieBaixa()
                ,fd.getComplexidadeDtoFd().getAieMedia()
                ,fd.getComplexidadeDtoFd().getAieAlta())));
        parametro.put("AIEPFTOTAL", transformarBigDecimal(fd.getComplexidadeDtoFd().getPfTotalAie()));
        parametro.put("AIEPFAJUSTADO", transformarBigDecimal(fd.getComplexidadeDtoFd().getPfAjustadoAie()));
    }

    /**
     * 
     * @param fd
     */
    private void popularComplexidadeInmFd(FuncoesDTO fd) {
        parametro.put("INMSEM", transformarInteiro(fd.getComplexidadeDtoFd().getInmSemFd()));
        parametro.put("INMBAIXA", transformarInteiro(fd.getComplexidadeDtoFd().getInmBaixaFd()));
        parametro.put("INMMEDIA", transformarInteiro(fd.getComplexidadeDtoFd().getInmMediaFd()));
        parametro.put("INMALTA", transformarInteiro(fd.getComplexidadeDtoFd().getInmAltaFd()));
        parametro.put("INMQUANTIDADE", transformarInteiro(somaQuantidades(
                 fd.getComplexidadeDtoFd().getInmSemFd()
                ,fd.getComplexidadeDtoFd().getInmBaixaFd()
                ,fd.getComplexidadeDtoFd().getInmMediaFd()
                ,fd.getComplexidadeDtoFd().getInmAltaFd())));
        parametro.put("INMPFTOTAL", transformarBigDecimal(fd.getComplexidadeDtoFd().getPfTotalInmFd()));
        parametro.put("INMPFAJUSTADO", transformarBigDecimal(fd.getComplexidadeDtoFd().getPfAjustadoInmFd()));
    }

    /**
     * 
     * @param fd
     */
    private void popularImpactoAli(FuncoesDTO fd) {
      parametro.put("ALIINCLUSAO", transformarInteiro(fd.getImpactoDtoFd().getAliInclusao()));
      parametro.put("ALIALTERACAO", transformarInteiro(fd.getImpactoDtoFd().getAliAlteracao()));
      parametro.put("ALIEXCLUSAO", transformarInteiro(fd.getImpactoDtoFd().getAliExclusao()));
      parametro.put("ALICONVERSAO", transformarInteiro(fd.getImpactoDtoFd().getAliConversao()));
    }

    /**
     * 
     * @param fd
     */
    private void popularImpactoAie(FuncoesDTO fd) {
      parametro.put("AIEINCLUSAO", transformarInteiro(fd.getImpactoDtoFd().getAieInclusao()));
      parametro.put("AIEALTERACAO", transformarInteiro(fd.getImpactoDtoFd().getAieAlteracao()));
      parametro.put("AIEEXCLUSAO", transformarInteiro(fd.getImpactoDtoFd().getAieExclusao()));
      parametro.put("AIECONVERSAO", transformarInteiro(fd.getImpactoDtoFd().getAieConversao()));
    }

    /**
     * 
     * @param fd
     */
    private void popularImpactoInmFd(FuncoesDTO fd) {
      parametro.put("INMINCLUSAO", transformarInteiro(fd.getImpactoDtoFd().getInmInclusaoFd()));
      parametro.put("INMALTERACAO", transformarInteiro(fd.getImpactoDtoFd().getInmAlteracaoFd()));
      parametro.put("INMEXCLUSAO", transformarInteiro(fd.getImpactoDtoFd().getInmExclusaoFd()));
      parametro.put("INMCONVERSAO", transformarInteiro(fd.getImpactoDtoFd().getInmConversaoFd()));
    }

    /**
     * 
     * @param ft
     */
    private void popularComplexidadeEe(FuncoesDTO ft) {
        parametro.put("EESEM", transformarInteiro(ft.getComplexidadeDtoFt().getEeSem()));
        parametro.put("EEBAIXA", transformarInteiro(ft.getComplexidadeDtoFt().getEeBaixa()));
        parametro.put("EEMEDIA", transformarInteiro(ft.getComplexidadeDtoFt().getEeMedia()));
        parametro.put("EEALTA", transformarInteiro(ft.getComplexidadeDtoFt().getEeAlta()));
        parametro.put("EEQUANTIDADE", transformarInteiro(somaQuantidades(
                 ft.getComplexidadeDtoFt().getEeSem()
                ,ft.getComplexidadeDtoFt().getEeBaixa()
                ,ft.getComplexidadeDtoFt().getEeMedia()
                ,ft.getComplexidadeDtoFt().getEeAlta())));
        parametro.put("EEPFTOTAL", transformarBigDecimal(ft.getComplexidadeDtoFt().getPfTotalEe()));
        parametro.put("EEPFAJUSTADO", transformarBigDecimal(ft.getComplexidadeDtoFt().getPfAjustadoEe()));
    }

    /**
     * 
     * @param ft
     */
    private void popularComplexidadeSe(FuncoesDTO ft) {
        parametro.put("SESEM", transformarInteiro(ft.getComplexidadeDtoFt().getSeSem()));
        parametro.put("SEBAIXA", transformarInteiro(ft.getComplexidadeDtoFt().getSeBaixa()));
        parametro.put("SEMEDIA", transformarInteiro(ft.getComplexidadeDtoFt().getSeMedia()));
        parametro.put("SEALTA", transformarInteiro(ft.getComplexidadeDtoFt().getSeAlta()));
        parametro.put("SEQUANTIDADE", transformarInteiro(somaQuantidades(
                 ft.getComplexidadeDtoFt().getSeSem()
                ,ft.getComplexidadeDtoFt().getSeBaixa()
                ,ft.getComplexidadeDtoFt().getSeMedia()
                ,ft.getComplexidadeDtoFt().getSeAlta())));
        parametro.put("SEPFTOTAL", transformarBigDecimal(ft.getComplexidadeDtoFt().getPfTotalSe()));
        parametro.put("SEPFAJUSTADO", transformarBigDecimal(ft.getComplexidadeDtoFt().getPfAjustadoSe()));
    }

    /**
     * 
     * @param ft
     */
    private void popularComplexidadeCe(FuncoesDTO ft) {
        parametro.put("CESEM", transformarInteiro(ft.getComplexidadeDtoFt().getCeSem()));
        parametro.put("CEBAIXA", transformarInteiro(ft.getComplexidadeDtoFt().getCeBaixa()));
        parametro.put("CEMEDIA", transformarInteiro(ft.getComplexidadeDtoFt().getCeMedia()));
        parametro.put("CEALTA", transformarInteiro(ft.getComplexidadeDtoFt().getCeAlta()));
        parametro.put("CEQUANTIDADE", transformarInteiro(somaQuantidades(
                 ft.getComplexidadeDtoFt().getCeSem()
                ,ft.getComplexidadeDtoFt().getCeBaixa()
                ,ft.getComplexidadeDtoFt().getCeMedia()
                ,ft.getComplexidadeDtoFt().getCeAlta())));
        parametro.put("CEPFTOTAL", transformarBigDecimal(ft.getComplexidadeDtoFt().getPfTotalCe()));
        parametro.put("CEPFAJUSTADO", transformarBigDecimal(ft.getComplexidadeDtoFt().getPfAjustadoCe()));
    }

    /**
     * 
     * @param ft
     */
    private void popularComplexidadeInmFt(FuncoesDTO ft) {
        parametro.put("INMFTSEM", transformarInteiro(ft.getComplexidadeDtoFt().getInmSemFt()));
        parametro.put("INMFTBAIXA", transformarInteiro(ft.getComplexidadeDtoFt().getInmBaixaFt()));
        parametro.put("INMFTMEDIA", transformarInteiro(ft.getComplexidadeDtoFt().getInmMediaFt()));
        parametro.put("INMFTALTA", transformarInteiro(ft.getComplexidadeDtoFt().getInmAltaFt()));
        parametro.put("INMFTQUANTIDADE", transformarInteiro(somaQuantidades(
                 ft.getComplexidadeDtoFt().getInmSemFt()
                ,ft.getComplexidadeDtoFt().getInmBaixaFt()
                ,ft.getComplexidadeDtoFt().getInmMediaFt()
                ,ft.getComplexidadeDtoFt().getInmAltaFt())));
        parametro.put("INMFTPFTOTAL", transformarBigDecimal(ft.getComplexidadeDtoFt().getPfTotalInmFt()));
        parametro.put("INMFTPFAJUSTADO", transformarBigDecimal(ft.getComplexidadeDtoFt().getPfAjustadoInmFt()));
    }

    /**
     * 
     * @param ft
     */
    private void popularImpactoEe(FuncoesDTO ft) {
        parametro.put("EEINCLUSAO", transformarInteiro(ft.getImpactoDtoFt().getEeInclusao()));
        parametro.put("EEALTERACAO", transformarInteiro(ft.getImpactoDtoFt().getEeAlteracao()));
        parametro.put("EEEXCLUSAO", transformarInteiro(ft.getImpactoDtoFt().getEeExclusao()));
        parametro.put("EECONVERSAO", transformarInteiro(ft.getImpactoDtoFt().getEeConversao()));
    }

    /**
     * 
     * @param ft
     */
    private void popularImpactoSe(FuncoesDTO ft) {
        parametro.put("SEINCLUSAO", transformarInteiro(ft.getImpactoDtoFt().getSeInclusao()));
        parametro.put("SEALTERACAO", transformarInteiro(ft.getImpactoDtoFt().getSeAlteracao()));
        parametro.put("SEEXCLUSAO", transformarInteiro(ft.getImpactoDtoFt().getSeExclusao()));
        parametro.put("SECONVERSAO", transformarInteiro(ft.getImpactoDtoFt().getSeConversao()));
    }

    /**
     * 
     * @param ft
     */
    private void popularImpactoCe(FuncoesDTO ft) {
        parametro.put("CEINCLUSAO", transformarInteiro(ft.getImpactoDtoFt().getCeInclusao()));
        parametro.put("CEALTERACAO", transformarInteiro(ft.getImpactoDtoFt().getCeAlteracao()));
        parametro.put("CEEXCLUSAO", transformarInteiro(ft.getImpactoDtoFt().getCeExclusao()));
        parametro.put("CECONVERSAO", transformarInteiro(ft.getImpactoDtoFt().getCeConversao()));
    }

    /**
     * 
     * @param ft
     */
    private void popularImpactoInmFt(FuncoesDTO ft) {
        parametro.put("INMFTINCLUSAO", transformarInteiro(ft.getImpactoDtoFt().getInmInclusaoFt()));
        parametro.put("INMFTALTERACAO", transformarInteiro(ft.getImpactoDtoFt().getInmAlteracaoFt()));
        parametro.put("INMFTEXCLUSAO", transformarInteiro(ft.getImpactoDtoFt().getInmExclusaoFt()));
        parametro.put("INMFTCONVERSAO", transformarInteiro(ft.getImpactoDtoFt().getInmConversaoFt()));
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

    /**
     * 
     * @param valor
     * @return
     */
    private String transformarInteiro(Integer valor) {
        if(valor == null) {
            valor = 0;
        }
        return valor.toString();
    }

    /**
     * 
     * @param valor
     * @return
     */
    private String transformarBigDecimal(Double valor) {
        if(valor == null) {
            valor = 0.0;
        }
        return valor.toString().replace(".", ",");
    }
    
    /**
     * 
     * @param valor1
     * @param valor2
     * @return
     */
    private String calcularPFsAjustado(String valor1, String valor2) {
        Double valorCalculado = 0.0;
        if(valor1 != null && valor2 != null) {
            valorCalculado = Double.parseDouble(valor1) - Double.parseDouble(valor2);
        }
        return valorCalculado.toString().replace(".", ".").substring(0,3);
    }

}

