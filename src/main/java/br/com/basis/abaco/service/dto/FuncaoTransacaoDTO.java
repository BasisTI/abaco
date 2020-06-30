package br.com.basis.abaco.service.dto;

/**
 * @author eduardo.andrade
 * @since 28/06/2018
 */
public class FuncaoTransacaoDTO {

    private String nomeFt;

    private String classificacaoFt;

    private String impactoFt;

    private String ftrFt;

    private String derFt;

    private String complexidadeFt;

    private String pfTotalFt;

    private String pfAjustadoFt;

    private String fatorAjusteFt;

    private String fatorAjusteValor;

    private String modulo;

    private String submodulo;

    private Integer identificador;

    private String sustantation;

    private String der;

    private String ftr;

    public String getFatorAjusteValor() {
        return fatorAjusteValor;
    }

    public void setFatorAjusteValor(String fatorAjusteValor) {
        this.fatorAjusteValor = fatorAjusteValor;
    }

    public String getModulo() {
        return modulo;
    }

    public void setModulo(String modulo) {
        this.modulo = modulo;
    }

    public String getSubmodulo() {
        return submodulo;
    }

    public void setSubmodulo(String submodulo) {
        this.submodulo = submodulo;
    }

    public String getFatorAjusteFt() {
        return fatorAjusteFt;
    }

    public void setFatorAjusteFt(String fatorAjusteFt) {
        this.fatorAjusteFt = fatorAjusteFt;
    }

    public String getNomeFt() {
        return nomeFt;
    }

    public void setNomeFt(String nomeFt) {
        this.nomeFt = nomeFt;
    }

    public String getClassificacaoFt() {
        return classificacaoFt;
    }

    public void setClassificacaoFt(String classificacaoFt) {
        this.classificacaoFt = classificacaoFt;
    }

    public String getImpactoFt() {
        return impactoFt;
    }

    public void setImpactoFt(String impactoFt) {
        this.impactoFt = impactoFt;
    }

    public String getFtrFt() {
        return ftrFt;
    }

    public void setFtrFt(String ftrFt) {
        this.ftrFt = ftrFt;
    }

    public String getDerFt() {
        return derFt;
    }

    public void setDerFt(String derFt) {
        this.derFt = derFt;
    }

    public String getComplexidadeFt() {
        return complexidadeFt;
    }

    public void setComplexidadeFt(String complexidadeFt) {
        this.complexidadeFt = complexidadeFt;
    }

    public String getPfTotalFt() {
        return pfTotalFt;
    }

    public void setPfTotalFt(String pfTotalFt) {
        this.pfTotalFt = pfTotalFt;
    }

    public String getPfAjustadoFt() {
        return pfAjustadoFt;
    }

    public void setPfAjustadoFt(String pfAjustadoFt) {
        this.pfAjustadoFt = pfAjustadoFt;
    }

    public Integer getIdentificador() {
        return identificador;
    }

    public void setIdentificador(Integer identificador) {
        this.identificador = identificador;
    }

    public String getSustantation() {
        return sustantation;
    }

    public void setSustantation(String sustantation) {
        this.sustantation = sustantation;
    }

    public String getDer() {
        return der;
    }

    public void setDer(String der) {
        this.der = der;
    }

    public String getFtr() {
        return ftr;
    }

    public void setFtr(String ftr) {
        this.ftr = ftr;
    }
}
