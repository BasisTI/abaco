package br.com.basis.abaco.service.dto;

/**
 * @author eduardo.andrade
 * @since 28/06/2018
 */
public class FuncaoDadosDTO {

    private String nomeFd;

    private String classificacaoFd;

    private String impactoFd;

    private String rlrFd;

    private String derFd;

    private String complexidadeFd;

    private String pfTotalFd;

    private String pfAjustadoFd;

    private String fatorAjusteFd;

    private String fatorAjusteValor;

    private String modulo;

    private String submodulo;

    private Integer identificador;

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

    public String getFatorAjusteFd() {
        return fatorAjusteFd;
    }

    public void setFatorAjusteFd(String fatorAjusteFd) {
        this.fatorAjusteFd = fatorAjusteFd;
    }

    public String getNomeFd() {
        return nomeFd;
    }

    public void setNomeFd(String nomeFd) {
        this.nomeFd = nomeFd;
    }

    public String getClassificacaoFd() {
        return classificacaoFd;
    }

    public void setClassificacaoFd(String classificacaoFd) {
        this.classificacaoFd = classificacaoFd;
    }

    public String getImpactoFd() {
        return impactoFd;
    }

    public void setImpactoFd(String impactoFd) {
        this.impactoFd = impactoFd;
    }

    public String getRlrFd() {
        return rlrFd;
    }

    public void setRlrFd(String rlrFd) {
        this.rlrFd = rlrFd;
    }

    public String getDerFd() {
        return derFd;
    }

    public void setDerFd(String derFd) {
        this.derFd = derFd;
    }

    public String getComplexidadeFd() {
        return complexidadeFd;
    }

    public void setComplexidadeFd(String complexidadeFd) {
        this.complexidadeFd = complexidadeFd;
    }

    public String getPfTotalFd() {
        return pfTotalFd;
    }

    public void setPfTotalFd(String pfTotalFd) {
        this.pfTotalFd = pfTotalFd;
    }

    public String getPfAjustadoFd() {
        return pfAjustadoFd;
    }

    public void setPfAjustadoFd(String pfAjustadoFd) {
        this.pfAjustadoFd = pfAjustadoFd;
    }

    public Integer getIdentificador() {
        return identificador;
    }

    public void setIdentificador(Integer identificador) {
        this.identificador = identificador;
    }
}
