package br.com.basis.abaco.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;
import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

/**
 * A BaseLineSintetico.
 */
@Entity
@Immutable
@Table(name = "baseline_sintetico")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "baselinesintetico")
public class BaseLineSintetico implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id_sistema", precision=10, scale=2)
    private BigDecimal idsistema;

    @Column(name = "sigla")
    private String sigla;

    @Column(name = "nome")
    private String nome;

    @Column(name = "numero_ocorrencia")
    private String numeroocorrencia;

    @Column(name = "sum", precision=10, scale=2)
    private BigDecimal sum;

    public BigDecimal getIdsistema() {
        return idsistema;
    }

    public BaseLineSintetico idsistema(BigDecimal idsistema) {
        this.idsistema = idsistema;
        return this;
    }

    public void setIdsistema(BigDecimal idsistema) {
        this.idsistema = idsistema;
    }

    public String getSigla() {
        return sigla;
    }

    public BaseLineSintetico sigla(String sigla) {
        this.sigla = sigla;
        return this;
    }

    public void setSigla(String sigla) {
        this.sigla = sigla;
    }

    public String getNome() {
        return nome;
    }

    public BaseLineSintetico nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getNumeroocorrencia() {
        return numeroocorrencia;
    }

    public BaseLineSintetico numeroocorrencia(String numeroocorrencia) {
        this.numeroocorrencia = numeroocorrencia;
        return this;
    }

    public void setNumeroocorrencia(String numeroocorrencia) {
        this.numeroocorrencia = numeroocorrencia;
    }

    public BigDecimal getSum() {
        return sum;
    }

    public BaseLineSintetico sum(BigDecimal sum) {
        this.sum = sum;
        return this;
    }

    public void setSum(BigDecimal sum) {
        this.sum = sum;
    }
}
