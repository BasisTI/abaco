package br.com.basis.abaco.domain;

import br.com.basis.abaco.domain.enumeration.Complexidade;
import br.com.basis.abaco.domain.enumeration.ImpactoFatorAjuste;
import br.com.basis.abaco.domain.enumeration.TipoFuncaoDados;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Enumerated;
import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Transient;
import javax.persistence.CascadeType;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

/**
 * A FuncaoDados.
 */
@Entity
@Table(name = "funcao_dados")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "funcao_dados")
public class FuncaoDados extends FuncaoAnalise implements Serializable {

    private static final long serialVersionUID = 1L;
    private static final String FUNCAODADOS = "funcaoDados";

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo")
    private TipoFuncaoDados tipo;

    @ManyToOne
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @OrderBy("nome ASC, id ASC")
    private Funcionalidade funcionalidade;

    @Column
    private String retStr;

    @Column
    private Integer quantidade;

    @OneToMany(mappedBy = FUNCAODADOS, cascade = CascadeType.ALL, orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @OrderBy("valor ASC")
    private Set<Rlr> rlrs = new HashSet<>();

    @ManyToOne
    private Alr alr;

    @OneToMany(mappedBy = FUNCAODADOS, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UploadedFile> files = new ArrayList<>();

    @OneToMany(mappedBy = FUNCAODADOS, orphanRemoval = true)
    private List<DivergenceCommentFuncaoDados> lstDivergenceComments = new ArrayList<>();

    @Transient
    private Set<String> rlrValues = new HashSet<>();

    @OneToMany(mappedBy = FUNCAODADOS, cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    private Set<Der> ders = new LinkedHashSet<>();

    @JsonIgnore
    @ManyToOne
    private FuncaoDadosVersionavel funcaoDadosVersionavel;

    @Enumerated(EnumType.STRING)
    @Column(name = "impacto")
    private ImpactoFatorAjuste impacto;

    public FuncaoDados() {
    }

    public FuncaoDados(FuncaoDados funcaoDados) {

        this.tipo = funcaoDados.getTipo();
        this.funcionalidade = funcaoDados.getFuncionalidade();
        this.retStr = funcaoDados.getRetStr();
        this.quantidade = funcaoDados.getQuantidade();
        this.rlrs = funcaoDados.getRlrs();
        this.alr = funcaoDados.getAlr();
        this.files = funcaoDados.getFiles();
        this.ders = funcaoDados.getDers();
        this.funcaoDadosVersionavel = funcaoDados.getFuncaoDadosVersionavel();
        this.impacto = funcaoDados.getImpacto();
        this.files = funcaoDados.getFiles();

    }

    public void bindFuncaoDados(Complexidade complexidade, BigDecimal pf, BigDecimal grossPF, Analise analise, Funcionalidade funcionalidade, String detStr, FatorAjuste fatorAjuste, String name, String sustantation, Set<String> derValues, TipoFuncaoDados tipo, String retStr, Integer quantidade, Set<Rlr> rlrs, Alr alr, List<UploadedFile> files, Set<String> rlrValues, Set<Der> ders, FuncaoDadosVersionavel funcaoDadosVersionavel, ImpactoFatorAjuste impacto) {
        this.tipo = tipo;
        this.funcionalidade = funcionalidade;
        this.retStr = retStr;
        this.quantidade = quantidade;
        this.rlrs =  rlrs == null ? null : Collections.unmodifiableSet(rlrs);
        this.alr = alr;
        this.files = files == null ? null : Collections.unmodifiableList(files);
        this.rlrValues =  rlrValues == null ? null : Collections.unmodifiableSet(rlrValues);
        this.ders = ders == null ? null : Collections.unmodifiableSet(ders);
        this.funcaoDadosVersionavel = funcaoDadosVersionavel;
        this.impacto = impacto;
        bindFuncaoAnalise(null, complexidade, pf, grossPF, analise, funcionalidade, detStr, fatorAjuste, name, sustantation, derValues, null);
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

    public Set<Rlr> getRlrs() {
        return Optional.ofNullable(this.rlrs)
                .map(lista -> new LinkedHashSet<Rlr>(lista))
                .orElse(new LinkedHashSet<Rlr>());
    }

    public FuncaoDados rlrs(Set<Rlr> rlrs) {
        this.rlrs = Optional.ofNullable(rlrs)
                .map(lista -> new LinkedHashSet<Rlr>(lista))
                .orElse(new LinkedHashSet<Rlr>());
        return this;
    }

    public FuncaoDados addRlr(Rlr rlr) {
        if (rlr == null) {
            return this;
        }
        this.rlrs.add(rlr);
        rlr.setFuncaoDados(this);
        return this;
    }

    public FuncaoDados removeRlr(Rlr rlr) {
        if (rlr == null) {
            return this;
        }
        this.rlrs.remove(rlr);
        rlr.setFuncaoDados(null);
        return this;
    }

    public void setRlrs(Set<Rlr> rlrs) {
        this.rlrs = Optional.ofNullable(rlrs)
            .map(lista -> new LinkedHashSet<Rlr>(lista))
            .orElse(new LinkedHashSet<Rlr>());
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
        List<UploadedFile> cp = new ArrayList<>();
        cp.addAll(files);
        return cp;
    }

    public void setFiles(List<UploadedFile> files) {
        this.files.clear();
        if (files != null) {
            this.files.addAll(files);
            files.forEach(item -> {
                item.setFuncaoDados(this);
            });
        }
    }
    public void addFiles(UploadedFile file){
        this.files.add(file);
        file.setFuncaoDados(this);
    }
    public void removeArquivoEvidencia(UploadedFile file){
        this.files.remove(file);
    }

    public Set<String> getRlrValues() {
        return Collections.unmodifiableSet(rlrValues);
    }

    public void setRlrValues(Set<String> rlrValues) {
        this.rlrValues = Optional.ofNullable(rlrValues)
                .map((lista) -> new HashSet<String>(lista))
                .orElse(new HashSet<String>());
    }

    public Set<Der> getDers() {
        return Optional.ofNullable(this.ders)
            .map(lista -> new LinkedHashSet<Der>(lista))
            .orElse(new LinkedHashSet<Der>());
    }

    public void setDers(Set<Der> ders) {
        this.ders = Optional.ofNullable(ders)
            .map(LinkedHashSet::new)
            .orElse(new LinkedHashSet<Der>());
    }

    public FuncaoDadosVersionavel getFuncaoDadosVersionavel() {
        return funcaoDadosVersionavel;
    }

    public void setFuncaoDadosVersionavel(FuncaoDadosVersionavel funcaoDadosVersionavel) {
        this.funcaoDadosVersionavel = funcaoDadosVersionavel;
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

    public List<DivergenceCommentFuncaoDados> getLstDivergenceComments() {
        return  Collections.unmodifiableList(lstDivergenceComments);
    }

    public void setLstDivergenceComments(List<DivergenceCommentFuncaoDados> lstDivergenceComments) {
        this.lstDivergenceComments =  Optional.ofNullable(lstDivergenceComments)
            .map(ArrayList::new)
            .orElse(new ArrayList<>());;
    }

    public void updateDers(Set<Der> ders){
        this.ders.clear();
        this.ders.addAll(ders);
    }

    public void updateRlrs(Set<Rlr> rlrs){
        this.rlrs.clear();
        this.rlrs.addAll(rlrs);
    }
}
