package br.com.basis.abaco.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.*;

import br.com.basis.abaco.domain.enumeration.TipoFuncaoTransacao;

import br.com.basis.abaco.domain.enumeration.Complexidade;

/**
 * A FuncaoTransacao.
 */
@Entity
@Table(name = "funcao_transacao")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "funcaotransacao")
public class FuncaoTransacao implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo")
    private TipoFuncaoTransacao tipo;

    @Enumerated(EnumType.STRING)
    @Column(name = "complexidade")
    private Complexidade complexidade;

    @Column(name = "pf", precision=10, scale=2)
    private BigDecimal pf;

    @ManyToOne
    @JoinColumn(name = "analise_id")
    private Analise analise;

    @OneToMany(mappedBy = "funcaoTransacao")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Funcionalidade> funcionalidades = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "funcionalidade_id")
    private Funcionalidade funcionalidade;

    @Column
    private String detStr;

    @Column
    private String ftrStr;

    @Column
    private String sustantation;

    @ManyToOne
    private FatorAjuste fatorAjuste;

    @Column
    private String name;

    @OneToMany(mappedBy = "funcaoTransacao")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Alr> alrs = new HashSet<>();

    @OneToMany(mappedBy = "funcaoTransacao", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<UploadedFile> files = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TipoFuncaoTransacao getTipo() {
        return tipo;
    }

    public FuncaoTransacao tipo(TipoFuncaoTransacao tipo) {
        this.tipo = tipo;
        return this;
    }

    public void setTipo(TipoFuncaoTransacao tipo) {
        this.tipo = tipo;
    }

    public Complexidade getComplexidade() {
        return complexidade;
    }

    public FuncaoTransacao complexidade(Complexidade complexidade) {
        this.complexidade = complexidade;
        return this;
    }

    public void setComplexidade(Complexidade complexidade) {
        this.complexidade = complexidade;
    }

    public BigDecimal getPf() {
        return pf;
    }

    public FuncaoTransacao pf(BigDecimal pf) {
        this.pf = pf;
        return this;
    }

    public void setPf(BigDecimal pf) {
        this.pf = pf;
    }

    public Analise getAnalise() {
        return analise;
    }

    public FuncaoTransacao analise(Analise analise) {
        this.analise = analise;
        return this;
    }

    public void setAnalise(Analise analise) {
        this.analise = analise;
    }

    public Set<Funcionalidade> getFuncionalidades() {
        return funcionalidades;
    }

    public FuncaoTransacao funcionalidades(Set<Funcionalidade> funcionalidades) {
        this.funcionalidades = funcionalidades;
        return this;
    }

    public FuncaoTransacao addFuncionalidade(Funcionalidade funcionalidade) {
        this.funcionalidades.add(funcionalidade);
        funcionalidade.setFuncaoTransacao(this);
        return this;
    }

    public FuncaoTransacao removeFuncionalidade(Funcionalidade funcionalidade) {
        this.funcionalidades.remove(funcionalidade);
        funcionalidade.setFuncaoTransacao(null);
        return this;
    }

    public void setFuncionalidades(Set<Funcionalidade> funcionalidades) {
        this.funcionalidades = funcionalidades;
    }

    public FatorAjuste getFatorAjuste() {
        return fatorAjuste;
    }

    public FuncaoTransacao fatorAjuste(FatorAjuste fatorAjuste) {
        this.fatorAjuste = fatorAjuste;
        return this;
    }

    public void setFatorAjuste(FatorAjuste fatorAjuste) {
        this.fatorAjuste = fatorAjuste;
    }

    public Set<Alr> getAlrs() {
        return alrs;
    }

    public FuncaoTransacao alrs(Set<Alr> alrs) {
        this.alrs = alrs;
        return this;
    }

    public FuncaoTransacao addAlr(Alr alr) {
        this.alrs.add(alr);
        alr.setFuncaoTransacao(this);
        return this;
    }

    public FuncaoTransacao removeAlr(Alr alr) {
        this.alrs.remove(alr);
        alr.setFuncaoTransacao(null);
        return this;
    }

    public void setAlrs(Set<Alr> alrs) {
        this.alrs = alrs;
    }

    public Funcionalidade getFuncionalidade() {
        return funcionalidade;
    }

    public void setFuncionalidade(Funcionalidade funcionalidade) {
        this.funcionalidade = funcionalidade;
    }

    public String getDetStr() {
        return detStr;
    }

    public void setDetStr(String detStr) {
        this.detStr = detStr;
    }

    public String getFtrStr() {
        return ftrStr;
    }

    public void setFtrStr(String ftrStr) {
        this.ftrStr = ftrStr;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSustantation() {
        return sustantation;
    }

    public void setSustantation(String sustantation) {
        this.sustantation = sustantation;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        FuncaoTransacao funcaoTransacao = (FuncaoTransacao) o;
        if (funcaoTransacao.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, funcaoTransacao.id);
    }


    public List<UploadedFile> getFiles() {
        return files;
    }

    public void setFiles(List<UploadedFile> files) {
        this.files = files;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "FuncaoTransacao{" +
            "id=" + id +
            ", tipo='" + tipo + "'" +
            ", complexidade='" + complexidade + "'" +
            ", pf='" + pf + "'" +
            '}';
    }
}
