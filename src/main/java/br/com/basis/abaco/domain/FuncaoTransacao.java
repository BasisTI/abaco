package br.com.basis.abaco.domain;

import br.com.basis.abaco.domain.audit.AbacoAudit;
import br.com.basis.abaco.domain.enumeration.Complexidade;
import br.com.basis.abaco.domain.enumeration.ImpactoFatorAjuste;
import br.com.basis.abaco.domain.enumeration.TipoFuncaoTransacao;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "funcao_transacao")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "funcao_transacao")
@JsonInclude(Include.NON_EMPTY)
@Getter
@Setter
@AllArgsConstructor
public class FuncaoTransacao extends FuncaoAnalise implements Serializable {

    private static final long serialVersionUID = 1L;
    private static final String FUNCAOTRANSACAO = "funcaoTransacao";

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo")
    private TipoFuncaoTransacao tipo;

    @OneToMany(mappedBy = FUNCAOTRANSACAO)
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @OrderBy("nome ASC, id ASC")
    private Set<Funcionalidade> funcionalidades = new HashSet<>();

    @Column
    private String ftrStr;

    @Column
    private Integer quantidade;


    @JsonManagedReference(value = FUNCAOTRANSACAO)
    @OneToMany(mappedBy = FUNCAOTRANSACAO, cascade = CascadeType.ALL, orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Alr> alrs = new HashSet<>();

    @OneToMany(mappedBy = FUNCAOTRANSACAO, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UploadedFile> files = new ArrayList<>();

    @Transient
    private Set<String> ftrValues = new HashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "impacto")
    private ImpactoFatorAjuste impacto;

    @JsonManagedReference(value = FUNCAOTRANSACAO)
    @OneToMany(mappedBy = FUNCAOTRANSACAO, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Der> ders = new HashSet<>();

    @JsonIgnore
    @ManyToOne
    private Analise analise;

    public FuncaoTransacao() {
    }


    public void bindFuncaoTransacao(TipoFuncaoTransacao tipo, Set<Funcionalidade> funcionalidades, String ftrStr, Integer quantidade, Set<Alr> alrs, List<UploadedFile> files, Set<String> ftrValues, ImpactoFatorAjuste impacto, Set<Der> ders, Analise analise, Long id, Complexidade complexidade, BigDecimal pf, BigDecimal grossPF, Funcionalidade funcionalidade, String detStr, FatorAjuste fatorAjuste, String name, String sustantation, Set<String> derValues, AbacoAudit audit) {
        this.tipo = tipo;
        this.funcionalidades = funcionalidades;
        this.ftrStr = ftrStr;
        this.quantidade = quantidade;
        this.alrs = alrs;
        this.files = files;
        this.ftrValues = ftrValues;
        this.impacto = impacto;
        this.ders = ders;
        this.analise = analise;
        bindFuncaoAnalise(null, complexidade, pf, grossPF, analise, funcionalidade, detStr, fatorAjuste, name, sustantation, derValues, null);
    }


    public TipoFuncaoTransacao getTipo() {
        return this.tipo;
    }

    public Set<Funcionalidade> getFuncionalidades() {
        return this.funcionalidades;
    }

    public String getFtrStr() {
        return this.ftrStr;
    }

    public Integer getQuantidade() {
        return this.quantidade;
    }

    public Set<Alr> getAlrs() {
        return this.alrs;
    }

    public List<UploadedFile> getFiles() {
        return this.files;
    }

    public Set<String> getFtrValues() {
        return this.ftrValues;
    }

    public ImpactoFatorAjuste getImpacto() {
        return this.impacto;
    }

    public Set<Der> getDers() {
        return this.ders;
    }

    public Analise getAnalise() {
        return this.analise;
    }

    public void setTipo(TipoFuncaoTransacao tipo) {
        this.tipo = tipo;
    }

    public void setFuncionalidades(Set<Funcionalidade> funcionalidades) {
        this.funcionalidades = funcionalidades;
    }

    public void setFtrStr(String ftrStr) {
        this.ftrStr = ftrStr;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public void setAlrs(Set<Alr> alrs) {
        this.alrs = alrs;
    }

    public void setFiles(List<UploadedFile> files) {
        this.files = files;
    }

    public void setFtrValues(Set<String> ftrValues) {
        this.ftrValues = ftrValues;
    }

    public void setImpacto(ImpactoFatorAjuste impacto) {
        this.impacto = impacto;
    }

    public void setDers(Set<Der> ders) {
        this.ders = ders;
    }

    public void setAnalise(Analise analise) {
        this.analise = analise;
    }
}
