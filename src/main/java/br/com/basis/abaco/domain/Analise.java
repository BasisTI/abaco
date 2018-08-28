package br.com.basis.abaco.domain;

import java.io.Serializable;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
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
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.Size;

import br.com.basis.dynamicexports.pojo.ReportObject;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldIndex;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import br.com.basis.abaco.domain.audit.AbacoAudit;
import br.com.basis.abaco.domain.enumeration.MetodoContagem;
import br.com.basis.abaco.domain.enumeration.TipoAnalise;
import io.swagger.annotations.ApiModel;

/**
 * <Enter note text here>
 */
@ApiModel(description = "<Enter note text here>")
@Entity
@Table(name = "analise")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "analise")
@EntityListeners(AuditingEntityListener.class)
public class Analise implements Serializable, ReportObject {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "numero_os")
    @Field (index = FieldIndex.not_analyzed, type = FieldType.String)
    private String numeroOs;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_contagem")
    private MetodoContagem metodoContagem;

    @Column(name = "valor_ajuste", precision = 10, scale = 4)
    private BigDecimal valorAjuste;

    @Column(name = "pf_total")
    @Field (index = FieldIndex.not_analyzed, type = FieldType.String)
    private String pfTotal;

    @Column(name = "pf_total_adjust")
    @Field (index = FieldIndex.not_analyzed, type = FieldType.String)
    private String adjustPFTotal;

    @Size(max = 4000)
    @Column(name = "escopo", length = 4000)
    @Field (index = FieldIndex.not_analyzed, type = FieldType.String)
    private String escopo;

    @Size(max = 4000)
    @Column(name = "fronteiras", length = 4000)
    @Field (index = FieldIndex.not_analyzed, type = FieldType.String)
    private String fronteiras;

    @Size(max = 4000)
    @Column(name = "documentacao", length = 4000)
    @Field (index = FieldIndex.not_analyzed, type = FieldType.String)
    private String documentacao;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_analise")
    private TipoAnalise tipoAnalise;

    @Size(max = 4000)
    @Column(name = "proposito_contagem", length = 4000)
    private String propositoContagem;

    @ManyToOne
    private Sistema sistema;

    @ManyToOne
    private Contrato contrato;

    @ManyToOne(fetch = FetchType.EAGER)
    private Organizacao organizacao;

    @Embedded
    private AbacoAudit audit = new AbacoAudit();

    // FIXME @CreatedBy e @LastModifiedBy de Analise não seguem o padrão dado em
    // User
    // atualmente se um funciona, o outro não
    // O de User espera uma string com o login do usuário
    // Analise espera o User completo
    // Comentando por enquanto para nao gastar muito tempo e evitar alteracoes no
    // banco
    @ManyToOne
    // @CreatedBy
    @JoinColumn
    private User createdBy;

    @ManyToOne
    @JoinColumn
    private User editedBy;

    @OneToMany(mappedBy = "analise", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JsonManagedReference
    private Set<FuncaoDados> funcaoDados = new HashSet<>();

    @OneToMany(mappedBy = "analise", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JsonManagedReference
    private Set<FuncaoTransacao> funcaoTransacaos = new HashSet<>();

    @ManyToOne
    private FatorAjuste fatorAjuste;

    @ManyToMany(fetch = FetchType.EAGER)
    private Set<EsforcoFase> esforcoFases;

    @Size(max = 4000)
    @Column(name = "observacoes", length = 4000)
    private String observacoes;

    @Column(name = "baseline_imediatamente")
    private Boolean baselineImediatamente;

    @Column(name = "data_homologacao_software")
    private Date dataHomologacao;

    @Column(name = "identificador_analise", length = 100)
    private String identificadorAnalise;

    @Column(name = "bloqueado")
    private boolean bloqueiaAnalise;

    @ManyToOne
    private TipoEquipe equipeResponsavel;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroOs() {
        return numeroOs;
    }

    public Analise numeroOs(String numeroOs) {
        this.numeroOs = numeroOs;
        return this;
    }

    public void setNumeroOs(String numeroOs) {
        this.numeroOs = numeroOs;
    }

    public BigDecimal getValorAjuste() {
        return valorAjuste;
    }

    public Analise valorAjuste(BigDecimal valorAjuste) {
        this.valorAjuste = valorAjuste;
        return this;
    }

    public void setValorAjuste(BigDecimal valorAjuste) {
        this.valorAjuste = valorAjuste;
    }

    public String getPfTotal() {
        return pfTotal;
    }

    public Analise pfTotal(String pfTotal) {
        this.pfTotal = pfTotal;
        return this;
    }

    public void setPfTotal(String pfTotal) {
        this.pfTotal = pfTotal;
    }

    public String getEscopo() {
        return escopo;
    }

    public Analise escopo(String escopo) {
        this.escopo = escopo;
        return this;
    }

    public void setEscopo(String escopo) {
        this.escopo = escopo;
    }

    public String getFronteiras() {
        return fronteiras;
    }

    public Analise fronteiras(String fronteiras) {
        this.fronteiras = fronteiras;
        return this;
    }

    public void setFronteiras(String fronteiras) {
        this.fronteiras = fronteiras;
    }

    public String getDocumentacao() {
        return documentacao;
    }

    public Analise documentacao(String documentacao) {
        this.documentacao = documentacao;
        return this;
    }

    public void setDocumentacao(String documentacao) {
        this.documentacao = documentacao;
    }

    public TipoAnalise getTipoAnalise() {
        return tipoAnalise;
    }

    public Analise tipoAnalise(TipoAnalise tipoAnalise) {
        this.tipoAnalise = tipoAnalise;
        return this;
    }

    public void setTipoAnalise(TipoAnalise tipoAnalise) {
        this.tipoAnalise = tipoAnalise;
    }

    public String getPropositoContagem() {
        return propositoContagem;
    }

    public Analise propositoContagem(String propositoContagem) {
        this.propositoContagem = propositoContagem;
        return this;
    }

    public void setPropositoContagem(String propositoContagem) {
        this.propositoContagem = propositoContagem;
    }

    public Sistema getSistema() {
        return sistema;
    }

    public String getNomeSistema() { return sistema.getNome(); }

    public Analise sistema(Sistema sistema) {
        this.sistema = sistema;
        return this;
    }

    public void setSistema(Sistema sistema) {
        this.sistema = sistema;
    }

    public Set<FuncaoDados> getFuncaoDados() {
        return funcaoDados;
    }

    public Analise funcaoDados(Set<FuncaoDados> funcaoDados) {
        this.funcaoDados = funcaoDados;
        return this;
    }

    public Analise addFuncaoDados(FuncaoDados funcaoDados) {
        this.funcaoDados.add(funcaoDados);
        funcaoDados.setAnalise(this);
        return this;
    }

    public Analise removeFuncaoDados(FuncaoDados funcaoDados) {
        this.funcaoDados.remove(funcaoDados);
        funcaoDados.setAnalise(null);
        return this;
    }

    public void setFuncaoDados(Set<FuncaoDados> funcaoDados) {
        this.funcaoDados = funcaoDados;
    }

    public Set<FuncaoTransacao> getFuncaoTransacaos() {
        return funcaoTransacaos;
    }

    public Analise funcaoTransacaos(Set<FuncaoTransacao> funcaoTransacaos) {
        this.funcaoTransacaos = funcaoTransacaos;
        return this;
    }

    public Analise addFuncaoTransacao(FuncaoTransacao funcaoTransacao) {
        this.funcaoTransacaos.add(funcaoTransacao);
        funcaoTransacao.setAnalise(this);
        return this;
    }

    public Analise removeFuncaoTransacao(FuncaoTransacao funcaoTransacao) {
        this.funcaoTransacaos.remove(funcaoTransacao);
        funcaoTransacao.setAnalise(null);
        return this;
    }

    public void setFuncaoTransacaos(Set<FuncaoTransacao> funcaoTransacaos) {
        this.funcaoTransacaos = funcaoTransacaos;
    }

    public Contrato getContrato() {
        return contrato;
    }

    public Long getGarantiaRestante() throws ParseException {
        if (contrato == null || dataHomologacao == null){ return 0l; }
        Integer garantia = contrato.getDiasDeGarantia();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date dateWithoutTime = sdf.parse(sdf.format(new Date()));
        Long diferenca = dateWithoutTime.getTime() - dataHomologacao.getTime();
        if (garantia - (diferenca / 86400000) < 0){
            return 0l;
        }
        return garantia - (diferenca / 86400000);
    }

    public void setContrato(Contrato contrato) {
        this.contrato = contrato;
    }

    public Organizacao getOrganizacao() {
        return organizacao;
    }

    public String getNomeOrg(){ return organizacao.getNome(); }

    public void setOrganizacao(Organizacao organizacao) {
        this.organizacao = organizacao;
    }

    public String getAdjustPFTotal() {
        return adjustPFTotal;
    }

    public void setAdjustPFTotal(String adjustPFTotal) {
        this.adjustPFTotal = adjustPFTotal;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Analise analise = (Analise) o;
        if (analise.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, analise.id);
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

    public FatorAjuste getFatorAjuste() {
        return fatorAjuste;
    }

    public void setFatorAjuste(FatorAjuste fatorAjuste) {
        this.fatorAjuste = fatorAjuste;
    }

    public Set<EsforcoFase> getEsforcoFases() {
        return Collections.unmodifiableSet(esforcoFases);
    }

    public void setEsforcoFases(Set<EsforcoFase> esforcoFases) {
        this.esforcoFases = new HashSet<EsforcoFase>(esforcoFases);
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    public Boolean getBaselineImediatamente() {
        return baselineImediatamente;
    }

    public void setBaselineImediatamente(Boolean baselineImediatamente) {
        this.baselineImediatamente = baselineImediatamente;
    }

    public Boolean getbloqueiaAnalise() {
        return bloqueiaAnalise;
    }

    public String getBloqueiaString() {
        if (bloqueiaAnalise) {
            return "Sim";
        } return "Não";
    }

    public void setbloqueiaAnalise(Boolean bloqueiaAnalise) {
        this.bloqueiaAnalise = bloqueiaAnalise;
    }

    public MetodoContagem getMetodoContagem() {
		return metodoContagem;
	}

	public  String getMetodoContagemString() {
        if (metodoContagem == null) {
            return "";
        }
        return metodoContagem.toString();
    }

	public void setMetodoContagem(MetodoContagem metodoContagem) {
		this.metodoContagem = metodoContagem;
	}

    public Analise metodoContagem(MetodoContagem metodoContagem) {
        this.metodoContagem = metodoContagem;
        return this;
    }

	public Date getDataHomologacao() {
		return dataHomologacao;
	}

	public void setDataHomologacao(Date dataHomologacao) {
		this.dataHomologacao = dataHomologacao;
	}

	public String getIdentificadorAnalise() {
		return identificadorAnalise;
	}

	public void setIdentificadorAnalise(String identificadorAnalise) {
		this.identificadorAnalise = identificadorAnalise;
	}

	public TipoEquipe getEquipeResponsavel() {
		return equipeResponsavel;
	}

	public String getNomeEquipe() { return equipeResponsavel.getNome(); }

	public void setEquipeResponsavel(TipoEquipe equipeResponsavel) {
		this.equipeResponsavel = equipeResponsavel;
	}

	public AbacoAudit getAudit() {
		return audit;
	}

	public void setAudit(AbacoAudit audit) {
		this.audit = audit;
	}

    public ZonedDateTime getCreatedOn() {
        return audit.getCreatedOn();
    }

    public void setCreatedOn(ZonedDateTime createdOn) { audit.setCreatedOn(createdOn); }

    public ZonedDateTime getUpdatedOn() {
        return audit.getUpdatedOn();
    }

    public void setUpdatedOn(ZonedDateTime updatedOn) { audit.setUpdatedOn(updatedOn); }

	@Override
    public String toString() {
        // // @formatter:off
        return "Analise{" +
            "id=" + id +
            ", numeroOs='" + numeroOs + "'" +
            ", tipoContagem='" + metodoContagem + "'" +
            ", dataHomologacao='" + dataHomologacao + "'" +
            ", valorAjuste='" + valorAjuste + "'" +
            ", pfTotal='" + pfTotal + "'" +
            ", escopo='" + escopo + "'" +
            ", fronteiras='" + fronteiras + "'" +
            ", documentacao='" + documentacao + "'" +
            ", tipoAnalise='" + tipoAnalise + "'" +
            ", propositoContagem='" + propositoContagem + "'" +
            '}';
        // @formatter:on
    }

}
