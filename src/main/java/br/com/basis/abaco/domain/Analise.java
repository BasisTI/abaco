package br.com.basis.abaco.domain;

import br.com.basis.abaco.domain.audit.AbacoAudit;
import br.com.basis.abaco.domain.enumeration.MetodoContagem;
import br.com.basis.abaco.domain.enumeration.TipoAnalise;
import br.com.basis.dynamicexports.pojo.ReportObject;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.jetbrains.annotations.Nullable;
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
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
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
@Getter
@Setter
@NoArgsConstructor
public class Analise implements Serializable, ReportObject {

    private static final String ANALISE = "analise";

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "numero_os")
    private String numeroOs;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_contagem")
    @Field(index = FieldIndex.not_analyzed, type = FieldType.String)
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

    @Column(name = "clonada_para_equipe")
    private Boolean clonadaParaEquipe = false;

    @Column(name = "is_divergence")
    @Field(type = FieldType.Boolean, index = FieldIndex.not_analyzed)
    private Boolean isDivergence = false;

    @Column(name = "bloqueado")
    private boolean bloqueiaAnalise;

    @Column(name = "enviar_baseline")
    private boolean enviarBaseline;

    @ManyToOne
    private Sistema sistema;

    @ManyToOne
    private Status status;

    @ManyToOne
    private Contrato contrato;

    @JsonInclude
    @ManyToOne
    private Organizacao organizacao;

    @Embedded
    private AbacoAudit audit = new AbacoAudit();

    @JsonInclude
    @Field(type = FieldType.Nested, index = FieldIndex.not_analyzed)
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_analise", joinColumns = @JoinColumn(name = "analise_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<User> users = new HashSet<>();

    @ManyToOne
    @JoinColumn
    private User createdBy;

    @ManyToOne
    @JoinColumn
    private User editedBy;

    @OneToMany(mappedBy = "analises")
    private Set<Compartilhada> compartilhadas = new HashSet<>();


    @JsonInclude
    @OneToMany(mappedBy = ANALISE, cascade = CascadeType.ALL)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @OrderBy("name ASC, funcionalidade ASC, id ASC")
    private Set<FuncaoDados> funcaoDados = new HashSet<>();

    @JsonInclude
    @OneToMany(mappedBy = ANALISE, cascade = CascadeType.ALL)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @OrderBy("name ASC, funcionalidade ASC, id ASC")
    private Set<FuncaoTransacao> funcaoTransacaos = new HashSet<>();

    @Nullable
    @ManyToOne
    private FatorAjuste fatorAjuste;

    @ManyToMany
    private Set<EsforcoFase> esforcoFases;

    @ManyToOne
    private TipoEquipe equipeResponsavel;

    @ManyToOne
    private Manual manual;

    @ManyToOne
    @JoinColumn(name="analise_divergence_id")
    private Analise analiseDivergence;

    @OneToMany(mappedBy = "analiseDivergence")
    @Field(type = FieldType.Nested, ignoreFields = {"analisesComparadas", "manual", "esforcoFases", "escopo", "dataHomologacao", "documentacao", "fronteiras", "users"})
    private Set<Analise> analisesComparadas = new HashSet<>();


    public Analise(Analise analise, User user) {
        this.id = null;
        this.identificadorAnalise = analise.identificadorAnalise;
        this.metodoContagem = analise.getMetodoContagem();
        this.valorAjuste = analise.getValorAjuste();
        this.pfTotal = analise.getPfTotal();
        this.adjustPFTotal = analise.getAdjustPFTotal();
        this.escopo = analise.getEscopo();
        this.fronteiras = analise.getFronteiras();
        this.documentacao = analise.getDocumentacao();
        this.tipoAnalise = analise.getTipoAnalise();
        this.propositoContagem = analise.getPropositoContagem();
        this.observacoes = analise.getObservacoes();
        this.baselineImediatamente = analise.getBaselineImediatamente();
        this.dataHomologacao = analise.getDataHomologacao();
        this.dataCriacaoOrdemServico = analise.getDataCriacaoOrdemServico();
        this.bloqueiaAnalise = analise.isBloqueiaAnalise();
        this.enviarBaseline = analise.isEnviarBaseline();
        this.sistema = analise.getSistema();
        this.contrato = analise.getContrato();
        this.organizacao = analise.getOrganizacao();
        this.createdBy = user;
        this.fatorAjuste = analise.getFatorAjuste();
        this.equipeResponsavel = analise.getEquipeResponsavel();
        this.manual = analise.getManual();
    }


    public void setDataHomologacao(Timestamp dataHomologacao) {
        if (dataHomologacao != null) {
            this.dataHomologacao = new Timestamp(dataHomologacao.getTime());
        } else {
            this.dataHomologacao = null;
        }
    }

    public Timestamp getDataHomologacao() {
        return this.dataHomologacao != null ? new Timestamp(this.dataHomologacao.getTime()) : null;
    }

    public void setDataCriacaoOrdemServico(Timestamp dataCriacaoOrdemServico) {
        if (dataCriacaoOrdemServico != null) {
            this.dataCriacaoOrdemServico = new Timestamp(dataCriacaoOrdemServico.getTime());
        } else {
            this.dataCriacaoOrdemServico = null;
        }
    }

    public Timestamp getDataCriacaoOrdemServico() {
        return this.dataCriacaoOrdemServico != null ? new Timestamp(this.dataCriacaoOrdemServico.getTime()) : null;
    }

    public String getMetodoContagemString() {
        if (metodoContagem == null) {
            return "";
        }
        return metodoContagem.toString();
    }

    public Long getGarantiaRestante() throws ParseException {
        if (contrato == null || dataHomologacao == null) {
            return 0l;
        }
        Integer garantia = contrato.getDiasDeGarantia();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date dateWithoutTime = sdf.parse(sdf.format(new Date()));
        Long diferenca = dateWithoutTime.getTime() - dataHomologacao.getTime();
        if (garantia - (diferenca / 86400000) < 0) {
            return 0l;
        }
        return garantia - (diferenca / 86400000);
    }

    public String getCreatedOn() {
        return this.dataCriacaoOrdemServico == null ? "" : new SimpleDateFormat("MM/dd/yyyy HH:mm:ss").format(this.dataCriacaoOrdemServico);
    }

    public String getBloqueiaString() {
        if (bloqueiaAnalise) {
            return "Sim";
        }
        return "Não";
    }
}
