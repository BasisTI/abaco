package br.com.basis.abaco.domain;

import br.com.basis.dynamicexports.pojo.ReportObject;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldIndex;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.DecimalMax;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A Manual.
 */
@Entity
@Table(name = "manual")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "manual")
public class Manual implements Serializable, ReportObject, Cloneable {

  private static final long serialVersionUID = 1L;
  private static final String MINPERCENT = "0";
  private static final String MAXPERCENT = "100";

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
  @SequenceGenerator(name = "sequenceGenerator")
  private Long id;

  @Column(name = "nome")
  @Field(index = FieldIndex.not_analyzed, type = FieldType.String)
  private String nome;

  @Size(max = 4000)
  @Column(name = "observacao", length = 4000)
  private String observacao;

  @NotNull
  @DecimalMin(value = MINPERCENT)
  @DecimalMax(value = MAXPERCENT)
  @Column(name = "valor_variacao_estimada", precision = 10, scale = 4, nullable = false)
  private BigDecimal valorVariacaoEstimada;

  @NotNull
  @DecimalMin(value = MINPERCENT)
  @DecimalMax(value = MAXPERCENT)
  @Column(name = "valor_variacao_indicativa", precision = 10, scale = 4, nullable = false)
  private BigDecimal valorVariacaoIndicativa;

  @Column(name = "arquivo_manual_id")
  private int arquivoManualId;

  @OneToMany(mappedBy = "manual", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
  @JsonManagedReference
  private Set<EsforcoFase> esforcoFases = new HashSet<>();

  @OneToMany(mappedBy = "manual", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
  @JsonManagedReference
  private Set<FatorAjuste> fatoresAjuste = new HashSet<>();

  @DecimalMin(value = MINPERCENT)
  @DecimalMax(value = MAXPERCENT)
  @Column(name = "parametro_inclusao")
  private BigDecimal parametroInclusao;

  @DecimalMin(value = MINPERCENT)
  @DecimalMax(value = MAXPERCENT)
  @Column(name = "parametro_alteracao")
  private BigDecimal parametroAlteracao;

  @DecimalMin(value = MINPERCENT)
  @DecimalMax(value = MAXPERCENT)
  @Column(name = "parametro_exclusao")
  private BigDecimal parametroExclusao;

  @DecimalMin(value = MINPERCENT)
  @DecimalMax(value = MAXPERCENT)
  @Column(name = "parametro_conversao")
  private BigDecimal parametroConversao;

  @Column(name = "versao_cpm")
  private Long versaoCPM;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getNome() {
    return nome;
  }

  public Manual nome(String nome) {
    this.nome = nome;
    return this;
  }

  public void setNome(String nome) {
    this.nome = nome;
  }

  public String getObservacao() {
    return observacao;
  }

  public Manual observacao(String observacao) {
    this.observacao = observacao;
    return this;
  }

  public void setObservacao(String observacao) {
    this.observacao = observacao;
  }

  public BigDecimal getValorVariacaoEstimada() {
    return valorVariacaoEstimada;
  }

  public Manual valorVariacaoEstimada(BigDecimal valorVariacaoEstimada) {
    this.valorVariacaoEstimada = valorVariacaoEstimada;
    return this;
  }

  public void setValorVariacaoEstimada(BigDecimal valorVariacaoEstimada) {
    this.valorVariacaoEstimada = valorVariacaoEstimada;
  }

  public BigDecimal getValorVariacaoIndicativa() {
    return valorVariacaoIndicativa;
  }

  public Manual valorVariacaoIndicativa(BigDecimal valorVariacaoIndicativa) {
    this.valorVariacaoIndicativa = valorVariacaoIndicativa;
    return this;
  }

  public void setValorVariacaoIndicativa(BigDecimal valorVariacaoIndicativa) {
    this.valorVariacaoIndicativa = valorVariacaoIndicativa;
  }

  public int getArquivoManualId() {
    return arquivoManualId;
  }

  public void setArquivoManualId(int arquivoManualId) {
    this.arquivoManualId = arquivoManualId;
  }

  public Set<EsforcoFase> getEsforcoFases() {
    return esforcoFases;
  }

  public Manual esforcoFases(Set<EsforcoFase> esforcoFases) {
    this.esforcoFases = esforcoFases;
    return this;
  }

  public Manual addEsforcoFase(EsforcoFase esforcoFase) {
    this.esforcoFases.add(esforcoFase);
    esforcoFase.setManual(this);
    return this;
  }

  public Manual removeEsforcoFase(EsforcoFase esforcoFase) {
    this.esforcoFases.remove(esforcoFase);
    esforcoFase.setManual(null);
    return this;
  }

  public void setEsforcoFases(Set<EsforcoFase> esforcoFases) {
    this.esforcoFases = esforcoFases;
  }

  public Set<FatorAjuste> getFatoresAjuste() {
    return fatoresAjuste;
  }

  public void setFatoresAjuste(Set<FatorAjuste> fatoresAjuste) {
    this.fatoresAjuste = fatoresAjuste;
  }

  public BigDecimal getParametroInclusao() {
    return parametroInclusao;
  }

  public void setParametroInclusao(BigDecimal parametroInclusao) {
    this.parametroInclusao = parametroInclusao;
  }

  public BigDecimal getParametroAlteracao() {
    return parametroAlteracao;
  }

  public void setParametroAlteracao(BigDecimal parametroAlteracao) {
    this.parametroAlteracao = parametroAlteracao;
  }

  public BigDecimal getParametroExclusao() {
    return parametroExclusao;
  }

  public void setParametroExclusao(BigDecimal parametroExclusao) {
    this.parametroExclusao = parametroExclusao;
  }

  public BigDecimal getParametroConversao() {
    return parametroConversao;
  }

  public void setParametroConversao(BigDecimal parametroConversao) {
    this.parametroConversao = parametroConversao;
  }

  public Long getVersaoCPM() {
    return versaoCPM;
  }

  public void setVersaoCPM(Long versaoCPM) {
    this.versaoCPM = versaoCPM;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Manual manual = (Manual) o;
    if (manual.id == null || id == null) {
      return false;
    }
    return Objects.equals(id, manual.id);
  }

  @Override
  public int hashCode() {
    return Objects.hashCode(id);
  }

  @Override
  public String toString() {
    return "Manual{" + "id=" + id + ", nome='" + nome + "'" + ", observacao='" + observacao + "'"
        + ", valorVariacaoEstimada='" + valorVariacaoEstimada + "'" + ", valorVariacaoIndicativa='"
        + valorVariacaoIndicativa + "'" + ", arquivoManualId='" + arquivoManualId + "'" + '}';
  }

  @Override
  public Manual clone() {
      Manual manual = new Manual();
      manual.setArquivoManualId(arquivoManualId);
      manual.setEsforcoFases(esforcoFases);
      manual.setFatoresAjuste(fatoresAjuste);
      manual.setId(id);
      manual.setNome(nome);
      manual.setObservacao(observacao);
      manual.setParametroAlteracao(parametroAlteracao);
      manual.setParametroConversao(parametroConversao);
      manual.setParametroExclusao(parametroExclusao);
      manual.setParametroInclusao(parametroInclusao);
      manual.setValorVariacaoEstimada(valorVariacaoEstimada);
      manual.setValorVariacaoIndicativa(valorVariacaoIndicativa);
      manual.setVersaoCPM(versaoCPM);
      return manual;
  }
}
