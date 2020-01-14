package br.com.basis.abaco.domain;

import br.com.basis.abaco.domain.audit.AbacoAudit;
import br.com.basis.abaco.domain.enumeration.MetodoContagem;
import br.com.basis.abaco.domain.enumeration.TipoAnalise;
import br.com.basis.dynamicexports.pojo.ReportObject;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import io.swagger.annotations.ApiModel;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldIndex;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

@ApiModel(description = "<Enter note text here>")
@Entity
@Table(name = "analise")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "analise")
@EntityListeners(AuditingEntityListener.class)
@Embeddable
@JsonInclude(Include.NON_EMPTY)
public class Analise implements Serializable, ReportObject {

    private static final String ANALISE = "analise";
    private static transient Logger log = LoggerFactory.getLogger(Analise.class);

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "numero_os")
    @Field(index = FieldIndex.not_analyzed, type = FieldType.String)
    private String numeroOs;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_contagem")
    private MetodoContagem metodoContagem;

    @Column(name = "valor_ajuste", precision = 10, scale = 4)
    private BigDecimal valorAjuste;

    @Column(name = "pf_total")
    @Field(index = FieldIndex.not_analyzed, type = FieldType.String)
    private String pfTotal;

    @Column(name = "pf_total_adjust")
    @Field(index = FieldIndex.not_analyzed, type = FieldType.String)
    private String adjustPFTotal;

    @Size(max = 4000)
    @Column(name = "escopo", length = 4000)
    @Field(index = FieldIndex.not_analyzed, type = FieldType.String)
    private String escopo;

    @Size(max = 4000)
    @Column(name = "fronteiras", length = 4000)
    @Field(index = FieldIndex.not_analyzed, type = FieldType.String)
    private String fronteiras;

    @Size(max = 4000)
    @Column(name = "documentacao", length = 4000)
    @Field(index = FieldIndex.not_analyzed, type = FieldType.String)
    private String documentacao;

    @Column(name = "tipo_analise")
    @Enumerated(EnumType.STRING)
    private TipoAnalise tipoAnalise;

    @Size(max = 4000)
    @Column(name = "proposito_contagem", length = 4000)
    private String propositoContagem;

    @Size(max = 4000)
    @Column(name = "observacoes", length = 4000)
    private String observacoes;

    @Column(name = "baseline_imediatamente")
    private Boolean baselineImediatamente;

    @JsonInclude
    @Column(name = "data_homologacao_software")
    @Field(type = FieldType.Date)
    private Timestamp dataHomologacao;

    @JsonInclude
    @Column(name = "data_criacao_ordem_servico")
    @Field(type = FieldType.Date)
    private Timestamp dataCriacaoOrdemServico;

    @Column(name = "identificador_analise", length = 100)
    private String identificadorAnalise;

    @Column(name = "bloqueado")
    private boolean bloqueiaAnalise;

    @JsonIgnore
    @Column(name = "enviar_baseline")
    private boolean enviarBaseline;

    @ManyToOne(fetch = FetchType.EAGER)
    private Sistema sistema;

    @JsonIgnore
    @ManyToOne
    private Contrato contrato;

    @JsonInclude
    @ManyToOne(fetch = FetchType.EAGER)
    private Organizacao organizacao;

    @Embedded
    private AbacoAudit audit = new AbacoAudit();

    @Field(type = FieldType.Nested, index = FieldIndex.not_analyzed)
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_analise", joinColumns = @JoinColumn(name = "analise_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<User> users;

    @ManyToOne
    @JoinColumn
    private User createdBy;

    @ManyToOne
    @JoinColumn
    private User editedBy;

    @OneToMany(mappedBy = "analises")
    private Set<Compartilhada> compartilhadas = new HashSet<>();

    @OneToMany(mappedBy = ANALISE, cascade = CascadeType.ALL, orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JsonIgnore
    @OrderBy("name ASC, funcionalidade ASC, id ASC")
    private Set<FuncaoDados> funcaoDados = new HashSet<>();

    @OneToMany(mappedBy = ANALISE, cascade = CascadeType.ALL, orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JsonIgnore
    @OrderBy("name ASC, funcionalidade ASC, id ASC")
    private Set<FuncaoTransacao> funcaoTransacaos = new HashSet<>();

    @JsonIgnore
    @Nullable
    @ManyToOne
    private FatorAjuste fatorAjuste;

    @JsonIgnore
    @ManyToMany
    private Set<EsforcoFase> esforcoFases;

    @ManyToOne(fetch = FetchType.EAGER)
    private TipoEquipe equipeResponsavel;

    @JsonIgnore
    @ManyToOne
    private Manual manual;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroOs() {
        return numeroOs;
    }

    public Analise() {
    }

    public Analise(String identificadorAnalise, String pfTotal, String adjustPFTotal, Sistema sistema,
                   Organizacao organizacao, Boolean baselineImediatamente, TipoEquipe equipeResponsavel, Manual manual) {
        this.id = null;
        this.identificadorAnalise = identificadorAnalise.concat(" - CÓPIA");
        this.pfTotal = pfTotal;
        this.adjustPFTotal = adjustPFTotal;
        this.sistema = sistema;
        this.organizacao = organizacao;
        this.baselineImediatamente = baselineImediatamente;
        this.equipeResponsavel = equipeResponsavel;
        this.manual = manual;
    }

    public void setNumeroOs(String numeroOs) {
        this.numeroOs = numeroOs;
    }

    public MetodoContagem getMetodoContagem() {
        return metodoContagem;
    }

    public void setMetodoContagem(MetodoContagem metodoContagem) {
        this.metodoContagem = metodoContagem;
    }

    public BigDecimal getValorAjuste() {
        return valorAjuste;
    }

    public void setValorAjuste(BigDecimal valorAjuste) {
        this.valorAjuste = valorAjuste;
    }

    public String getPfTotal() {
        return pfTotal;
    }

    public void setPfTotal(String pfTotal) {
        this.pfTotal = pfTotal;
    }

    public String getAdjustPFTotal() {
        return adjustPFTotal;
    }

    public void setAdjustPFTotal(String adjustPFTotal) {
        this.adjustPFTotal = adjustPFTotal;
    }

    public String getEscopo() {
        return escopo;
    }

    public void setEscopo(String escopo) {
        this.escopo = escopo;
    }

    public String getFronteiras() {
        return fronteiras;
    }

    public void setFronteiras(String fronteiras) {
        this.fronteiras = fronteiras;
    }

    public String getDocumentacao() {
        return documentacao;
    }

    public void setDocumentacao(String documentacao) {
        this.documentacao = documentacao;
    }

    public TipoAnalise getTipoAnalise() {
        return tipoAnalise;
    }

    public void setTipoAnalise(TipoAnalise tipoAnalise) {
        this.tipoAnalise = tipoAnalise;
    }

    public String getPropositoContagem() {
        return propositoContagem;
    }

    public void setPropositoContagem(String propositoContagem) {
        this.propositoContagem = propositoContagem;
    }

    public Sistema getSistema() {
        return sistema;
    }

    public void setSistema(Sistema sistema) {
        this.sistema = sistema;
    }

    public Contrato getContrato() {
        return contrato;
    }

    public void setContrato(Contrato contrato) {
        this.contrato = contrato;
    }

    public Organizacao getOrganizacao() {
        return organizacao;
    }

    public void setOrganizacao(Organizacao organizacao) {
        this.organizacao = organizacao;
    }

    public AbacoAudit getAudit() {
        return audit;
    }

    public void setAudit(AbacoAudit audit) {
        this.audit = audit;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public User getEditedBy() {
        return editedBy;
    }

    public void setEditedBy(User editedBy) {
        this.editedBy = editedBy;
    }

    public Set<Compartilhada> getCompartilhadas() {
        return compartilhadas;
    }

    public void setCompartilhadas(Set<Compartilhada> compartilhadas) {
        this.compartilhadas = compartilhadas;
    }

    public Set<FuncaoDados> getFuncaoDados() {
        return funcaoDados;
    }

    public void setFuncaoDados(Set<FuncaoDados> funcaoDados) {
        this.funcaoDados = funcaoDados;
    }

    public Set<FuncaoTransacao> getFuncaoTransacaos() {
        return funcaoTransacaos;
    }

    public void setFuncaoTransacaos(Set<FuncaoTransacao> funcaoTransacaos) {
        this.funcaoTransacaos = funcaoTransacaos;
    }

    public Timestamp getDataCriacaoOrdemServico() {
        return dataCriacaoOrdemServico;
    }

    public void setDataCriacaoOrdemServico(Timestamp dataCriacaoOrdemServico) {
        this.dataCriacaoOrdemServico = dataCriacaoOrdemServico;
    }

    public FatorAjuste getFatorAjuste() {
        return fatorAjuste;
    }

    public void setFatorAjuste(FatorAjuste fatorAjuste) {
        this.fatorAjuste = fatorAjuste;
    }

    public Set<EsforcoFase> getEsforcoFases() {
        return esforcoFases;
    }

    public void setEsforcoFases(Set<EsforcoFase> esforcoFases) {
        this.esforcoFases = esforcoFases;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public Boolean getBaselineImediatamente() {
        return baselineImediatamente;
    }

    public void setBaselineImediatamente(Boolean baselineImediatamente) {
        this.baselineImediatamente = baselineImediatamente;
    }

    public Timestamp getDataHomologacao() {
        return dataHomologacao;
    }

    public void setDataHomologacao(Timestamp dataHomologacao) {
        this.dataHomologacao = dataHomologacao;
    }

    public String getIdentificadorAnalise() {
        return identificadorAnalise;
    }

    public void setIdentificadorAnalise(String identificadorAnalise) {
        this.identificadorAnalise = identificadorAnalise;
    }

    public boolean isBloqueiaAnalise() {
        return bloqueiaAnalise;
    }

    public void setBloqueiaAnalise(boolean bloqueiaAnalise) {
        this.bloqueiaAnalise = bloqueiaAnalise;
    }

    public boolean isEnviarBaseline() {
        return enviarBaseline;
    }

    public void setEnviarBaseline(boolean enviarBaseline) {
        this.enviarBaseline = enviarBaseline;
    }

    public Manual getManual() {
        return manual;
    }

    public void setManual(Manual manual) {
        this.manual = manual;
    }

    public TipoEquipe getEquipeResponsavel() {
        return equipeResponsavel;
    }

    public void setEquipeResponsavel(TipoEquipe equipeResponsavel) {
        this.equipeResponsavel = equipeResponsavel;
    }
}
