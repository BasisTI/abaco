package br.com.basis.abaco.domain;

import br.com.basis.abaco.domain.enumeration.ImpactoFatorAjuste;
import br.com.basis.abaco.domain.enumeration.TipoFuncaoTransacao;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

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

    @Column
    private Integer quantidade;


    @JsonManagedReference(value = "funcaoTransacao")
    @OneToMany(mappedBy = "funcaoTransacao", cascade = CascadeType.ALL, orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Alr> alrs = new HashSet<>();

    @OneToMany(mappedBy = "funcaoTransacao", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UploadedFile> files = new ArrayList<>();

    @Transient
    private Set<String> ftrValues;

    @Enumerated(EnumType.STRING)
    @Column(name = "impacto")
    private ImpactoFatorAjuste impacto;

    @JsonManagedReference(value = "funcaoTransacao")
    @OneToMany(mappedBy = "funcaoTransacao", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Der> ders = new HashSet<>();

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
        Set<Funcionalidade> cp = new LinkedHashSet<>();
        cp.addAll(funcionalidades);
        return cp;
    }

    public FuncaoTransacao funcionalidades(Set<Funcionalidade> funcionalidades) {
        Set<Funcionalidade> cp = new LinkedHashSet<>();
        cp.addAll(funcionalidades);
        this.funcionalidades = cp;
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
        Set<Funcionalidade> cp = new LinkedHashSet<>();
        cp.addAll(funcionalidades);
        this.funcionalidades = cp;
    }

    public Set<Alr> getAlrs() {
        Set<Alr> cp = new LinkedHashSet<>();
        cp.addAll(alrs);
        return cp;
    }

    public FuncaoTransacao alrs(Set<Alr> alrs) {
        Set<Alr> cp = new LinkedHashSet<>();
        cp.addAll(alrs);
        this.alrs = cp;
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
        Set<Alr> cp = new LinkedHashSet<>();
        cp.addAll(alrs);
        this.alrs = cp;
    }

    public String getFtrStr() {
        return ftrStr;
    }

    public void setFtrStr(String ftrStr) {
        this.ftrStr = ftrStr;
    }

    public Set<Der> getDers() {
        return Collections.unmodifiableSet(ders);
    }

    public void setDers(Set<Der> ders) {
        this.ders = Optional.ofNullable(ders)
            .map((lista) -> new HashSet<Der>(lista))
            .orElse(new HashSet<Der>());
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

    @Override
    public int hashCode() {
        return super.hashCode();
    }

    public List<UploadedFile> getFiles() {
        List<UploadedFile> cp = new ArrayList<>();
        cp.addAll(files);
        return cp;
    }

    public void setFiles(List<UploadedFile> files) {
        List<UploadedFile> cp = new ArrayList<>();
        cp.addAll(files);
        this.files = cp;
    }

    public Set<String> getFtrValues() {
        return Collections.unmodifiableSet(ftrValues);
    }

    public void setFtrValues(Set<String> ftrValues) {
        this.ftrValues = Optional.ofNullable(ftrValues)
            .map((lista) -> new HashSet<String>(lista))
            .orElse(new HashSet<String>());
    }

    public ImpactoFatorAjuste getImpacto() {
        return impacto;
    }

    public void setImpacto(ImpactoFatorAjuste impacto) {
        this.impacto = impacto;
    }

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public Object getClone() throws CloneNotSupportedException {
        return super.clone();
    }
}
