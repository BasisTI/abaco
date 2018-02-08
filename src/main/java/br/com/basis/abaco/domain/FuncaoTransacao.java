package br.com.basis.abaco.domain;

import java.io.Serializable;
import java.math.BigDecimal;
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
import br.com.basis.abaco.domain.enumeration.TipoFuncaoTransacao;

/**
 * A FuncaoTransacao.
 */
@Entity
@Table(name = "funcao_transacao")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "funcaotransacao")
public class FuncaoTransacao extends FuncaoAnalise implements Serializable {

    private static final long serialVersionUID = 1L;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo")
    private TipoFuncaoTransacao tipo;

    @OneToMany(mappedBy = "funcaoTransacao")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Funcionalidade> funcionalidades = new HashSet<>();

    @Column
    private String ftrStr;
    
    @OneToMany(mappedBy = "funcaoTransacao")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Alr> alrs = new HashSet<>();

    @OneToMany(mappedBy = "funcaoTransacao", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<UploadedFile> files = new ArrayList<>();

    @Transient
    private Set<String> derValues;

    @Transient
    private Set<String> ftrValues;

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

    public String getFtrStr() {
        return ftrStr;
    }

    public void setFtrStr(String ftrStr) {
        this.ftrStr = ftrStr;
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
        if (funcaoTransacao.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), funcaoTransacao.getId());
    }

    public List<UploadedFile> getFiles() {
        return files;
    }

    public void setFiles(List<UploadedFile> files) {
        this.files = files;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "FuncaoTransacao{" + "id=" + getId() + ", tipo='" + tipo + "'" + ", complexidade='" + getComplexidade() + "'"
                + ", pf='" + getPf() + "'" + '}';
    }
    
    public Set<String> getDerValues() {
        return Collections.unmodifiableSet(derValues);
    }

    public void setDerValues(Set<String> derValues) {
        this.derValues = new HashSet<String>(derValues);
    }

    public Set<String> getFtrValues() {
        return Collections.unmodifiableSet(ftrValues);
    }

    public void setFtrValues(Set<String> ftrValues) {
        this.ftrValues = new HashSet<String>(ftrValues);
    }

}
