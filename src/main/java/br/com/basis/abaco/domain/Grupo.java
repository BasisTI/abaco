package br.com.basis.abaco.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;
import java.sql.Timestamp;

/**
 * A Grupo.
 */
@Entity
@Table(name = "grupo")
public class  Grupo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id_analise")
    private Long idAnalise;

    @Column(name = "organizacao")
    private String organizacao;

    @Column(name = "identificador_analise")
    private String identificadorAnalise;

    @Column(name = "equipe")
    private String equipe;

    @Column(name = "sistema")
    private String sistema;

    @Column(name = "metodo_contagem")
    private String metodoContagem;

    @Column(name = "pf_total")
    private String pfTotal;

    @Column(name = "pf_ajustado")
    private String pfAjustado;

    @Column(name = "dias_de_garantia")
    private Integer diasDeGarantia;

    @Column(name = "data_criacao")
    private Timestamp dataCriacao;

    @Column(name = "data_homologacao")
    private Timestamp dataHomologacao;

    @Column(name = "bloqueado")
    private Boolean bloqueado;

    public Long getIdAnalise() {
        return idAnalise;
    }

    public Grupo idAnalise(Long idAnalise) {
        this.idAnalise = idAnalise;
        return this;
    }

    public void setIdAnalise(Long idAnalise) {
        this.idAnalise = idAnalise;
    }

    public String getOrganizacao() {
        return organizacao;
    }

    public Grupo organizacao(String organizacao) {
        this.organizacao = organizacao;
        return this;
    }

    public void setOrganizacao(String organizacao) {
        this.organizacao = organizacao;
    }

    public String getIdentificadorAnalise() {
        return identificadorAnalise;
    }

    public Grupo identificadorAnalise(String identificadorAnalise) {
        this.identificadorAnalise = identificadorAnalise;
        return this;
    }

    public void setIdentificadorAnalise(String identificadorAnalise) {
        this.identificadorAnalise = identificadorAnalise;
    }

    public String getEquipe() {
        return equipe;
    }

    public Grupo equipe(String equipe) {
        this.equipe = equipe;
        return this;
    }

    public void setEquipe(String equipe) {
        this.equipe = equipe;
    }

    public String getSistema() {
        return sistema;
    }

    public Grupo sistema(String sistema) {
        this.sistema = sistema;
        return this;
    }

    public void setSistema(String sistema) {
        this.sistema = sistema;
    }

    public String getMetodoContagem() {
        return metodoContagem;
    }

    public Grupo metodoContagem(String metodoContagem) {
        this.metodoContagem = metodoContagem;
        return this;
    }

    public void setMetodoContagem(String metodoContagem) {
        this.metodoContagem = metodoContagem;
    }

    public String getPfTotal() {
        return pfTotal;
    }

    public Grupo pfTotal(String pfTotal) {
        this.pfTotal = pfTotal;
        return this;
    }

    public void setPfTotal(String pfTotal) {
        this.pfTotal = pfTotal;
    }

    public String getPfAjustado() {
        return pfAjustado;
    }

    public Grupo pfAjustado(String pfAjustado) {
        this.pfAjustado = pfAjustado;
        return this;
    }

    public void setPfAjustado(String pfAjustado) {
        this.pfAjustado = pfAjustado;
    }

    public Integer getDiasDeGarantia() {
        return diasDeGarantia;
    }

    public Grupo diasDeGarantia(Integer diasDeGarantia) {
        this.diasDeGarantia = diasDeGarantia;
        return this;
    }

    public void setDiasDeGarantia(Integer diasDeGarantia) {
        this.diasDeGarantia = diasDeGarantia;
    }

    public Timestamp getDataHomologacao() {
        return dataHomologacao;
    }

    public Grupo dataHomologacao(Timestamp dataHomologacao) {
        this.dataHomologacao = dataHomologacao;
        return this;
    }

    public void setDataHomologacao(Timestamp dataHomologacao) {
        this.dataHomologacao = dataHomologacao;
    }

    public Boolean isBloqueado() {
        return bloqueado;
    }

    public Grupo bloqueado(Boolean bloqueado) {
        this.bloqueado = bloqueado;
        return this;
    }

    public void setBloqueado(Boolean bloqueado) {
        this.bloqueado = bloqueado;
    }



}
