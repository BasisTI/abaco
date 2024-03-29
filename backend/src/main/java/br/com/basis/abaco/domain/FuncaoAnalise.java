package br.com.basis.abaco.domain;

import br.com.basis.abaco.domain.audit.AbacoAudit;
import br.com.basis.abaco.domain.audit.AbacoAuditListener;
import br.com.basis.abaco.domain.audit.AbacoAuditable;
import br.com.basis.abaco.domain.enumeration.Complexidade;
import br.com.basis.abaco.domain.enumeration.StatusFuncao;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.EntityListeners;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import javax.persistence.OrderBy;
import javax.persistence.SequenceGenerator;
import javax.persistence.Transient;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import static java.util.Collections.unmodifiableSet;

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

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "analise_id")
    private Analise analise;

    @ManyToOne
    @JoinColumn(name = "funcionalidade_id")
    @OrderBy("nome ASC")
    private Funcionalidade funcionalidade;

    @Column
    private String detStr;

    @ManyToOne
    private FatorAjuste fatorAjuste;

    @Column
    private String name;

    @Column
    private String sustantation;

    @JsonIgnore
    @Transient
    private Set<String> derValues = new HashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "status_funcao")
    private StatusFuncao statusFuncao;

    @Column(name="ordem")
    private Long ordem;

    //Responsável por identificar qual equipe criou essa função , campo será utilizado em validação
    @ManyToOne
    @JoinColumn(name = "equipe_id")
    private TipoEquipe equipe;


    @Embedded
    // XXX deve ter o new() mesmo?
    private AbacoAudit audit = new AbacoAudit();

    protected void bindFuncaoAnalise(Long id, Complexidade complexidade, BigDecimal pf, BigDecimal grossPF, Analise analise, Funcionalidade funcionalidade, String detStr, FatorAjuste fatorAjuste, String name, String sustantation, Set<String> derValues, AbacoAudit audit, TipoEquipe tipoEquipe) {
        this.id = id;
        this.complexidade = complexidade;
        this.pf = pf;
        this.grossPF = grossPF;
        this.analise = analise;
        this.funcionalidade = funcionalidade;
        this.detStr = detStr;
        this.fatorAjuste = fatorAjuste;
        this.name = name;
        this.sustantation = sustantation;
        this.derValues = derValues == null ? null:Collections.unmodifiableSet(derValues);
        this.audit = audit;
        this.analise = analise;
        this.equipe = tipoEquipe;
    }

    public FuncaoAnalise() {
    }

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

    public BigDecimal getGrossPF() {
        return grossPF;
    }

    public void setGrossPF(BigDecimal grossPF) {
        this.grossPF = grossPF;
    }

    public Analise getAnalise() {
        return analise;
    }

    public void setAnalise(Analise analise) {
        this.analise = analise;
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

    public FatorAjuste getFatorAjuste() {
        return fatorAjuste;
    }

    public void setFatorAjuste(FatorAjuste fatorAjuste) {
        this.fatorAjuste = fatorAjuste;
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
        return unmodifiableSet(derValues);
    }

    public void setDerValues(Set<String> derValues) {
        this.derValues = unmodifiableSet(derValues);
    }

    @Override
    public AbacoAudit getAudit() {
        return audit;
    }

    @Override
    public void setAudit(AbacoAudit audit) {
        this.audit = audit;
    }

    public StatusFuncao getStatusFuncao() {
        return statusFuncao;
    }

    public void setStatusFuncao(StatusFuncao statusFuncao) {
        this.statusFuncao = statusFuncao;
    }

    public Long getOrdem() {
        return ordem;
    }

    public void setOrdem(Long ordem) {
        this.ordem = ordem;
    }

    public TipoEquipe getEquipe() {
        return equipe;
    }

    public void setEquipe(TipoEquipe equipe) {
        this.equipe = equipe;
    }
}
