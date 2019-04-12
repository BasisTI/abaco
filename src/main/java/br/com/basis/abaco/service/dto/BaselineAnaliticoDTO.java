package br.com.basis.abaco.service.dto;

import java.math.BigDecimal;

public class BaselineAnaliticoDTO {

    private Long id;

    private Long idfuncaodados;

    private Long idsistema;

    private Long equipeResponsavelId;

    private String tipo;

    private String impacto;

    private String classificacao;

    private Long analiseid;

    private String dataHomologacao;

    private String nome;

    private String nomeEquipe;

    private String sigla;

    private String name;

    private BigDecimal pf;

    private String complexidade;

    private BigDecimal der;

    private BigDecimal rlralr;

    private Long idfuncionalidade;


    public Long getIdfuncionalidade() {
        return idfuncionalidade;
    }

    public void setIdfuncionalidade(Long idfuncionalidade) {
        this.idfuncionalidade = idfuncionalidade;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdfuncaodados() {
        return idfuncaodados;
    }

    public void setIdfuncaodados(Long idfuncaodados) {
        this.idfuncaodados = idfuncaodados;
    }

    public Long getIdsistema() {
        return idsistema;
    }

    public void setIdsistema(Long idsistema) {
        this.idsistema = idsistema;
    }

    public Long getEquipeResponsavelId() {
        return equipeResponsavelId;
    }

    public void setEquipeResponsavelId(Long equipeResponsavelId) {
        this.equipeResponsavelId = equipeResponsavelId;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getImpacto() {
        return impacto;
    }

    public void setImpacto(String impacto) {
        this.impacto = impacto;
    }

    public String getClassificacao() {
        return classificacao;
    }

    public void setClassificacao(String classificacao) {
        this.classificacao = classificacao;
    }

    public Long getAnaliseid() {
        return analiseid;
    }

    public void setAnaliseid(Long analiseid) {
        this.analiseid = analiseid;
    }

    public String getDataHomologacao() {
        return dataHomologacao;
    }

    public void setDataHomologacao(String dataHomologacao) {
        this.dataHomologacao = dataHomologacao;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getNomeEquipe() {
        return nomeEquipe;
    }

    public void setNomeEquipe(String nomeEquipe) {
        this.nomeEquipe = nomeEquipe;
    }

    public String getSigla() {
        return sigla;
    }

    public void setSigla(String sigla) {
        this.sigla = sigla;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPf() {
        return pf;
    }

    public void setPf(BigDecimal pf) {
        this.pf = pf;
    }

    public String getComplexidade() {
        return complexidade;
    }

    public void setComplexidade(String complexidade) {
        this.complexidade = complexidade;
    }

    public BigDecimal getDer() {
        return der;
    }

    public void setDer(BigDecimal der) {
        this.der = der;
    }

    public BigDecimal getRlralr() {
        return rlralr;
    }

    public void setRlralr(BigDecimal rlralr) {
        this.rlralr = rlralr;
    }

}
