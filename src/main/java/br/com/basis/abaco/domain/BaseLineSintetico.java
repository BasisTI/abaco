package br.com.basis.abaco.domain;


import org.hibernate.annotations.Immutable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;
import java.math.BigDecimal;

/**
 * A BaseLineSintetico.
 */
@Entity
@Immutable
@Table(name = "baseline_sintetico")
public class BaseLineSintetico implements Serializable {

    @Id
    @Column(name = "id_sistema", precision=10, scale=2)
    private Long idsistema;

    @Column(name = "sigla")
    private String sigla;

    @Column(name = "nome")
    private String nome;

    @Column(name = "numero_ocorrencia")
    private String numeroocorrencia;

    @Column(name = "sum", precision=10, scale=2)
    private BigDecimal sum;

    public Long getIdsistema() {
        return idsistema;
    }

    public void setIdsistema(Long idsistema) {
        this.idsistema = idsistema;
    }

    public String getSigla() {
        return sigla;
    }

    public void setSigla(String sigla) {
        this.sigla = sigla;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getNumeroocorrencia() {
        return numeroocorrencia;
    }

    public void setNumeroocorrencia(String numeroocorrencia) {
        this.numeroocorrencia = numeroocorrencia;
    }

    public BigDecimal getSum() {
        return sum;
    }

    public void setSum(BigDecimal sum) {
        this.sum = sum;
    }
}
