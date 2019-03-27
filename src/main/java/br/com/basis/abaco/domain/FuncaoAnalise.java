package br.com.basis.abaco.domain;

import br.com.basis.abaco.domain.audit.AbacoAudit;
import br.com.basis.abaco.domain.audit.AbacoAuditListener;
import br.com.basis.abaco.domain.audit.AbacoAuditable;
import br.com.basis.abaco.domain.enumeration.Complexidade;
import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.EntityListeners;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import javax.persistence.SequenceGenerator;
import javax.persistence.Transient;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Optional;
import java.util.Set;

@MappedSuperclass
@EntityListeners(AbacoAuditListener.class)
public abstract class FuncaoAnalise implements AbacoAuditable {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "complexidade")
    private Complexidade complexidade;

    @Column(name = "pf", precision = 10, scale = 4)
    private BigDecimal pf;

    @Column(name = "grosspf", precision = 10, scale = 4)
    private BigDecimal grossPF;

    @ManyToOne
    @JoinColumn(name = "analise_id")
    @JsonBackReference
    private Analise analise;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "funcionalidade_id")
    private Funcionalidade funcionalidade;

    @Column
    private String detStr;

    @ManyToOne
    private FatorAjuste fatorAjuste;

    @Column
    private String name;

    @Column
    private String sustantation;

    @Transient
    private Set<String> derValues;

    @Embedded
    // XXX deve ter o new() mesmo?
    private AbacoAudit audit = new AbacoAudit();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Complexidade getComplexidade() {
        return complexidade;
    }

    public void setComplexidade(Complexidade complexidade) {
        this.complexidade = complexidade;
    }

    public BigDecimal getPf() {
        return pf;
    }

    public void setPf(BigDecimal pf) {
        this.pf = pf;
    }

    public Analise getAnalise() {
        return analise;
    }

    public void setAnalise(Analise analise) {
        this.analise = analise;
    }

    public FatorAjuste getFatorAjuste() {
        return fatorAjuste;
    }

    public void setFatorAjuste(FatorAjuste fatorAjuste) {
        this.fatorAjuste = fatorAjuste;
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

    public String getSustantation() {
        return sustantation;
    }

    public void setSustantation(String sustantation) {
        this.sustantation = sustantation;
    }

    public Set<String> getDerValues() {
        return Collections.unmodifiableSet(derValues);
    }

    public void setDerValues(Set<String> derValues) {
        this.derValues = Optional.ofNullable(derValues)
            .map(lista -> new HashSet<String>(lista))
            .orElse(new LinkedHashSet<String>());
    }

    @Override
    public AbacoAudit getAudit() {
        return audit;
    }

    @Override
    public void setAudit(AbacoAudit audit) {
        this.audit = audit;
    }

}
