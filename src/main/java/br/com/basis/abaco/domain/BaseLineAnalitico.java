package br.com.basis.abaco.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.hibernate.annotations.Immutable;
import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;
import java.util.Objects;

/**
 * A BaseLineAnalitico.
 */
@Entity
@Immutable
@Table(name = "baseline_analitico")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "baselineanalitico")
public class BaseLineAnalitico implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id_sistema", precision=10, scale=2)
    private Long idsistema;

    @Column(name = "tipo")
    private String tipo;

    @Column(name = "impacto")
    private String impacto;

    @Column(name = "analise_id")
    private Long analiseid;

    @Column(name = "data_homologacao_software")
    private Date dataHomologacao;

    @Column(name = "nome")
    private String nome;

    @Column(name = "sigla")
    private String sigla;

    @Column(name = "name")
    private String name;

    @Column(name = "pf")
    private BigDecimal pf;

    @Column(name = "id_funcao_dados")
    private Long idfuncaodados;

    @Column(name = "complexidade")
    private String complexidade;

    @Column(name = "der")
    private BigDecimal der;

    @Column(name = "rlr_alr")
    private BigDecimal rlralr;

    public BaseLineAnalitico() {
    }

    public Long getIdsistema() {
        return idsistema;
    }

    public void setIdsistema(Long idsistema) {
        this.idsistema = idsistema;
    }

    public String getImpacto() {
        return impacto;
    }

    public void setImpacto(String impacto) {
        this.impacto = impacto;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Long getAnaliseid() {
        return analiseid;
    }

    public void setAnaliseid(Long analiseid) {
        this.analiseid = analiseid;
    }

    public Date getDataHomologacao() {
        return dataHomologacao;
    }

    public void setDataHomologacao(Date dataHomologacao) {
        this.dataHomologacao = dataHomologacao;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
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

    public Long getIdfuncaodados() {
        return idfuncaodados;
    }

    public void setIdfuncaodados(Long idfuncaodados) {
        this.idfuncaodados = idfuncaodados;
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

    @Override
    public String toString() {
        return "BaseLineAnalitico{" +
            "idsistema=" + idsistema +
            ", impacto='" + impacto + '\'' +
            ", tipo='" + tipo + '\'' +
            ", analiseid=" + analiseid +
            ", dataHomologacao=" + dataHomologacao +
            ", nome='" + nome + '\'' +
            ", sigla='" + sigla + '\'' +
            ", name='" + name + '\'' +
            ", pf=" + pf +
            ", idfuncaodados=" + idfuncaodados +
            ", complexidade='" + complexidade + '\'' +
            ", der=" + der +
            ", rlralr=" + rlralr +
            '}';
    }
}
