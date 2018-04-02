package br.com.basis.abaco.domain;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
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
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import br.com.basis.abaco.domain.enumeration.TipoFuncaoDados;

/**
 * A FuncaoDados.
 */
@Entity
@Table(name = "funcao_dados")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "funcaodados")
public class FuncaoDados extends FuncaoAnalise implements Serializable {

    private static final long serialVersionUID = 1L;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo")
    private TipoFuncaoDados tipo;

    @OneToMany(mappedBy = "funcaoDados")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Funcionalidade> funcionalidades = new HashSet<>();

    @Column
    private String retStr;

    @JsonManagedReference(value = "funcaoDados")
    @OneToMany(mappedBy = "funcaoDados", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Rlr> rlrs = new HashSet<>();

    @ManyToOne
    private Alr alr;

    @OneToMany(mappedBy = "funcaoDados", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<UploadedFile> files = new ArrayList<>();

    @Transient
    private Set<String> rlrValues;

    @JsonManagedReference(value = "funcaoDados")
    @OneToMany(mappedBy = "funcaoDados", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private Set<Der> ders = new HashSet<>();

    @JsonIgnore
    @ManyToOne
    private FuncaoDadosVersionavel funcaoDadosVersionavel;
    
    @Column(name="impacto")
    private String impacto;

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

    public String getRetStr() {
        return retStr;
    }

    public void setRetStr(String retStr) {
        this.retStr = retStr;
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
        if (funcaoDados.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), funcaoDados.getId());
    }
    
    @Override
    public int hashCode() {
        return super.hashCode();
    }

    public List<UploadedFile> getFiles() {
        return files;
    }

    public void setFiles(List<UploadedFile> files) {
        this.files = files;
    }

    public Set<String> getRlrValues() {
        return Collections.unmodifiableSet(rlrValues);
    }

    public void setRlrValues(Set<String> rlrValues) {
        this.rlrValues = new HashSet<String>(rlrValues);
    }

    public Set<Der> getDers() {
        return Collections.unmodifiableSet(ders);
    }

    public void setDers(Set<Der> ders) {
        this.ders = new HashSet<Der>(ders);
    }

    public FuncaoDadosVersionavel getFuncaoDadosVersionavel() {
        return funcaoDadosVersionavel;
    }

    public void setFuncaoDadosVersionavel(FuncaoDadosVersionavel funcaoDadosVersionavel) {
        this.funcaoDadosVersionavel = funcaoDadosVersionavel;
    }

	public String getImpacto() {
		return impacto;
	}

	public void setImpacto(String impacto) {
		this.impacto = impacto;
	}

}
