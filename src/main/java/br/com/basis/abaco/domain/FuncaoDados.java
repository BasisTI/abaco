package br.com.basis.abaco.domain;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import br.com.basis.abaco.domain.enumeration.Complexidade;
import br.com.basis.abaco.domain.enumeration.TipoFuncaoDados;

/**
 * A FuncaoDados.
 */
@Entity
@Table(name = "funcao_dados")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "funcaodados")
public class FuncaoDados implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo")
    private TipoFuncaoDados tipo;

    @Enumerated(EnumType.STRING)
    @Column(name = "complexidade")
    private Complexidade complexidade;

    @Column(name = "pf", precision = 10, scale = 2)
    private BigDecimal pf;

    @Column(name = "grosspf", precision = 10, scale = 2)
    private BigDecimal grossPF;


    @ManyToOne
    @JoinColumn(name = "analise_id")
    @JsonBackReference
    private Analise analise;

    @OneToMany(mappedBy = "funcaoDados")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Funcionalidade> funcionalidades = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "funcionalidade_id")
    private Funcionalidade funcionalidade;

    @Column
    private String detStr;

    @Column
    private String retStr;


    @ManyToOne
    private FatorAjuste fatorAjuste;

    @Column
    private String name;

    @Column
    private String sustantation;

    @OneToMany(mappedBy = "funcaoDados")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Rlr> rlrs = new HashSet<>();

    @ManyToOne
    private Alr alr;

    @OneToMany(mappedBy = "funcaoDados", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<UploadedFile> files = new ArrayList<>();
    
    @Transient
    private Set<String> derValues;
    
    @Transient
    private Set<String> rlrValues;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TipoFuncaoDados getTipo() {
        return tipo;
    }

    public FuncaoDados tipo(TipoFuncaoDados tipo) {
        this.tipo = tipo;
        return this;
    }

    public void setTipo(TipoFuncaoDados tipo) {
        this.tipo = tipo;
    }

    public Complexidade getComplexidade() {
        return complexidade;
    }

    public FuncaoDados complexidade(Complexidade complexidade) {
        this.complexidade = complexidade;
        return this;
    }

    public void setComplexidade(Complexidade complexidade) {
        this.complexidade = complexidade;
    }

    public BigDecimal getPf() {
        return pf;
    }

    public FuncaoDados pf(BigDecimal pf) {
        this.pf = pf;
        return this;
    }

    public void setPf(BigDecimal pf) {
        this.pf = pf;
    }

    public Analise getAnalise() {
        return analise;
    }

    public FuncaoDados analise(Analise analise) {
        this.analise = analise;
        return this;
    }

    public void setAnalise(Analise analise) {
        this.analise = analise;
    }

    public Set<Funcionalidade> getFuncionalidades() {
        return funcionalidades;
    }

    public FuncaoDados funcionalidades(Set<Funcionalidade> funcionalidades) {
        this.funcionalidades = funcionalidades;
        return this;
    }

    public FuncaoDados addFuncionalidade(Funcionalidade funcionalidade) {
        this.funcionalidades.add(funcionalidade);
        funcionalidade.setFuncaoDados(this);
        return this;
    }

    public FuncaoDados removeFuncionalidade(Funcionalidade funcionalidade) {
        this.funcionalidades.remove(funcionalidade);
        funcionalidade.setFuncaoDados(null);
        return this;
    }

    public void setFuncionalidades(Set<Funcionalidade> funcionalidades) {
        this.funcionalidades = funcionalidades;
    }

    public FatorAjuste getFatorAjuste() {
        return fatorAjuste;
    }

    public FuncaoDados fatorAjuste(FatorAjuste fatorAjuste) {
        this.fatorAjuste = fatorAjuste;
        return this;
    }

    public void setFatorAjuste(FatorAjuste fatorAjuste) {
        this.fatorAjuste = fatorAjuste;
    }

    public Set<Rlr> getRlrs() {
        return rlrs;
    }

    public FuncaoDados rlrs(Set<Rlr> rlrs) {
        this.rlrs = rlrs;
        return this;
    }

    public FuncaoDados addRlr(Rlr rlr) {
        this.rlrs.add(rlr);
        rlr.setFuncaoDados(this);
        return this;
    }

    public FuncaoDados removeRlr(Rlr rlr) {
        this.rlrs.remove(rlr);
        rlr.setFuncaoDados(null);
        return this;
    }

    public void setRlrs(Set<Rlr> rlrs) {
        this.rlrs = rlrs;
    }

    public Alr getAlr() {
        return alr;
    }

    public FuncaoDados alr(Alr alr) {
        this.alr = alr;
        return this;
    }

    public void setAlr(Alr alr) {
        this.alr = alr;
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

    public String getRetStr() {
        return retStr;
    }

    public void setRetStr(String retStr) {
        this.retStr = retStr;
    }

    public BigDecimal getGrossPF() {
        return grossPF;
    }

    public void setGrossPF(BigDecimal grossPF) {
        this.grossPF = grossPF;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        FuncaoDados funcaoDados = (FuncaoDados) o;
        if (funcaoDados.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, funcaoDados.id);
    }


    public String getSustantation() {
        return sustantation;
    }


    public List<UploadedFile> getFiles() {
        return files;
    }

    public void setFiles(List<UploadedFile> files) {
        this.files = files;
    }

    public void setSustantation(String sustantation) {
        this.sustantation = sustantation;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "FuncaoDados{" +
            "id=" + id +
            ", tipo='" + tipo + "'" +
            ", complexidade='" + complexidade + "'" +
            ", pf='" + pf + "'" +
            '}';
    }

	public Set<String> getDerValues() {
		return derValues;
	}

	public void setDerValues(Set<String> derValues) {
		this.derValues = derValues;
	}

	public Set<String> getRlrValues() {
		return rlrValues;
	}

	public void setRlrValues(Set<String> rlrValues) {
		this.rlrValues = rlrValues;
	}
    
    
}
