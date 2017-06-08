package br.com.basis.abaco.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.annotations.ApiModel;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

import br.com.basis.abaco.domain.enumeration.MetodoContagem;

import br.com.basis.abaco.domain.enumeration.TipoAnalise;

/**
 * <Enter note text here>
 */
@ApiModel(description = "<Enter note text here>")
@Entity
@Table(name = "analise")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "analise")
public class Analise implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "numero_os")
    private String numeroOs;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_contagem")
    private MetodoContagem tipoContagem;

    @Column(name = "valor_ajuste", precision=10, scale=2)
    private BigDecimal valorAjuste;

    @Column(name = "pf_total")
    private String pfTotal;

    @Size(max = 4000)
    @Column(name = "escopo", length = 4000)
    private String escopo;

    @Size(max = 4000)
    @Column(name = "fronteiras", length = 4000)
    private String fronteiras;

    @Size(max = 4000)
    @Column(name = "documentacao", length = 4000)
    private String documentacao;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_analise")
    private TipoAnalise tipoAnalise;

    @Size(max = 4000)
    @Column(name = "proposito_contagem", length = 4000)
    private String propositoContagem;

    @ManyToOne
    private Sistema sistema;

    @OneToMany(mappedBy = "analise", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<FuncaoDados> funcaoDados = new HashSet<>();

    @OneToMany(mappedBy = "analise", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<FuncaoTransacao> funcaoTransacaos = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroOs() {
        return numeroOs;
    }

    public Analise numeroOs(String numeroOs) {
        this.numeroOs = numeroOs;
        return this;
    }

    public void setNumeroOs(String numeroOs) {
        this.numeroOs = numeroOs;
    }

    public MetodoContagem getTipoContagem() {
        return tipoContagem;
    }

    public Analise tipoContagem(MetodoContagem tipoContagem) {
        this.tipoContagem = tipoContagem;
        return this;
    }

    public void setTipoContagem(MetodoContagem tipoContagem) {
        this.tipoContagem = tipoContagem;
    }

    public BigDecimal getValorAjuste() {
        return valorAjuste;
    }

    public Analise valorAjuste(BigDecimal valorAjuste) {
        this.valorAjuste = valorAjuste;
        return this;
    }

    public void setValorAjuste(BigDecimal valorAjuste) {
        this.valorAjuste = valorAjuste;
    }

    public String getPfTotal() {
        return pfTotal;
    }

    public Analise pfTotal(String pfTotal) {
        this.pfTotal = pfTotal;
        return this;
    }

    public void setPfTotal(String pfTotal) {
        this.pfTotal = pfTotal;
    }

    public String getEscopo() {
        return escopo;
    }

    public Analise escopo(String escopo) {
        this.escopo = escopo;
        return this;
    }

    public void setEscopo(String escopo) {
        this.escopo = escopo;
    }

    public String getFronteiras() {
        return fronteiras;
    }

    public Analise fronteiras(String fronteiras) {
        this.fronteiras = fronteiras;
        return this;
    }

    public void setFronteiras(String fronteiras) {
        this.fronteiras = fronteiras;
    }

    public String getDocumentacao() {
        return documentacao;
    }

    public Analise documentacao(String documentacao) {
        this.documentacao = documentacao;
        return this;
    }

    public void setDocumentacao(String documentacao) {
        this.documentacao = documentacao;
    }

    public TipoAnalise getTipoAnalise() {
        return tipoAnalise;
    }

    public Analise tipoAnalise(TipoAnalise tipoAnalise) {
        this.tipoAnalise = tipoAnalise;
        return this;
    }

    public void setTipoAnalise(TipoAnalise tipoAnalise) {
        this.tipoAnalise = tipoAnalise;
    }

    public String getPropositoContagem() {
        return propositoContagem;
    }

    public Analise propositoContagem(String propositoContagem) {
        this.propositoContagem = propositoContagem;
        return this;
    }

    public void setPropositoContagem(String propositoContagem) {
        this.propositoContagem = propositoContagem;
    }

    public Sistema getSistema() {
        return sistema;
    }

    public Analise sistema(Sistema sistema) {
        this.sistema = sistema;
        return this;
    }

    public void setSistema(Sistema sistema) {
        this.sistema = sistema;
    }

    public Set<FuncaoDados> getFuncaoDados() {
        return funcaoDados;
    }

    public Analise funcaoDados(Set<FuncaoDados> funcaoDados) {
        this.funcaoDados = funcaoDados;
        return this;
    }

    public Analise addFuncaoDados(FuncaoDados funcaoDados) {
        this.funcaoDados.add(funcaoDados);
        funcaoDados.setAnalise(this);
        return this;
    }

    public Analise removeFuncaoDados(FuncaoDados funcaoDados) {
        this.funcaoDados.remove(funcaoDados);
        funcaoDados.setAnalise(null);
        return this;
    }

    public void setFuncaoDados(Set<FuncaoDados> funcaoDados) {
        this.funcaoDados = funcaoDados;
    }

    public Set<FuncaoTransacao> getFuncaoTransacaos() {
        return funcaoTransacaos;
    }

    public Analise funcaoTransacaos(Set<FuncaoTransacao> funcaoTransacaos) {
        this.funcaoTransacaos = funcaoTransacaos;
        return this;
    }

    public Analise addFuncaoTransacao(FuncaoTransacao funcaoTransacao) {
        this.funcaoTransacaos.add(funcaoTransacao);
        funcaoTransacao.setAnalise(this);
        return this;
    }

    public Analise removeFuncaoTransacao(FuncaoTransacao funcaoTransacao) {
        this.funcaoTransacaos.remove(funcaoTransacao);
        funcaoTransacao.setAnalise(null);
        return this;
    }

    public void setFuncaoTransacaos(Set<FuncaoTransacao> funcaoTransacaos) {
        this.funcaoTransacaos = funcaoTransacaos;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Analise analise = (Analise) o;
        if (analise.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, analise.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Analise{" +
            "id=" + id +
            ", numeroOs='" + numeroOs + "'" +
            ", tipoContagem='" + tipoContagem + "'" +
            ", valorAjuste='" + valorAjuste + "'" +
            ", pfTotal='" + pfTotal + "'" +
            ", escopo='" + escopo + "'" +
            ", fronteiras='" + fronteiras + "'" +
            ", documentacao='" + documentacao + "'" +
            ", tipoAnalise='" + tipoAnalise + "'" +
            ", propositoContagem='" + propositoContagem + "'" +
            '}';
    }
}
