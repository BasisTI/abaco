package br.com.basis.abaco.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

/**
 * A Contrato.
 */
@Entity
@Table(name = "contrato")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "contrato")
public class Contrato implements Serializable {

  private static final long serialVersionUID = 1L;

  private static transient Logger log = LoggerFactory.getLogger(Contrato.class);

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
  @SequenceGenerator(name = "sequenceGenerator")
  private Long id;

  @Column(name = "numero_contrato")
  @Field(index = FieldIndex.not_analyzed, type = FieldType.String)
  private String numeroContrato;

  @Column(name = "data_inicio_vigencia")
  @JsonDeserialize(using = LocalDateDeserializer.class)
  private LocalDate dataInicioVigencia;

  @Column(name = "data_fim_vigencia")
  @JsonDeserialize(using = LocalDateDeserializer.class)
  private LocalDate dataFimVigencia;

  @ManyToOne(fetch = FetchType.LAZY)
  @JsonIgnore
  private Manual manual;

  @JsonManagedReference
  @OneToMany(mappedBy = "contratos", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<ManualContrato> manualContrato = new HashSet<>();

  @ManyToOne
  @JsonBackReference
  private Organizacao organization;

  @NotNull
  @Column(name = "ativo", nullable = true)
  private Boolean ativo;

  @Column(name = "dias_de_garantia")
  private Integer diasDeGarantia;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getNumeroContrato() {
    return numeroContrato;
  }

  public Contrato numeroContrato(String numeroContrato) {
    this.numeroContrato = numeroContrato;
    return this;
  }

  public void setNumeroContrato(String numeroContrato) {
    this.numeroContrato = numeroContrato;
  }

  public LocalDate getDataInicioVigencia() {
    return dataInicioVigencia;
  }

  public Contrato dataInicioVigencia(LocalDate dataInicioVigencia) {
    this.dataInicioVigencia = dataInicioVigencia;
    return this;
  }

  public void setDataInicioVigencia(LocalDate dataInicioVigencia) {
    this.dataInicioVigencia = dataInicioVigencia;
  }

  public LocalDate getDataFimVigencia() {
    return dataFimVigencia;
  }

  public Contrato dataFimVigencia(LocalDate dataFimVigencia) {
    this.dataFimVigencia = dataFimVigencia;
    return this;
  }

  public void setDataFimVigencia(LocalDate dataFimVigencia) {
    this.dataFimVigencia = dataFimVigencia;
  }

  public void setManualContrato(Set<ManualContrato> manualContrato) {
    this.manualContrato = Optional.ofNullable(manualContrato)
        .map( lista -> new LinkedHashSet<ManualContrato>(lista) )
        .orElse(new LinkedHashSet<ManualContrato>());
  }

  public Organizacao getOrganization() {
      if (this.organization == null) {
          return null;
      } else {
          return (Organizacao) organization.getClone();
      }
  }

  public Set<ManualContrato> getManualContrato() {
      return Optional.ofNullable(this.manualContrato)
          .map(lista -> new LinkedHashSet<ManualContrato>(lista))
          .orElse(new LinkedHashSet<ManualContrato>());
  }

  public void setOrganization(Organizacao organization) {
      if (organization == null){
          this.organization = null;
      } else {
          this.organization = (Organizacao) organization.getClone();
      }
  }

  public Boolean getAtivo() {
    return ativo;
  }

  public void setAtivo(Boolean ativo) {
    this.ativo = ativo;
  }

  public Integer getDiasDeGarantia() {
    return diasDeGarantia;
  }

  public void setDiasDeGarantia(Integer diasDeGarantia) {
    this.diasDeGarantia = diasDeGarantia;
  }

  public Manual getManual() {
      try {
          if (this.manual == null) {
              return null;
          }
          return (Manual) this.manual.clone();
      } catch (CloneNotSupportedException e) {
          log.error(e.getMessage(), e);
          return null;
      }
  }

  public void setManual(Manual manual) {
      try {
          if (manual == null) {
              this.manual = null;
          } else {
              this.manual = (Manual) manual.clone();
          }
      } catch (CloneNotSupportedException e) {
          log.error(e.getMessage(), e);
          this.manual = null;
      }
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Contrato contrato = (Contrato) o;
    if (contrato.id == null || id == null) {
      return false;
    }
    return Objects.equals(id, contrato.id);
  }

  @Override
  public int hashCode() {
    return Objects.hashCode(id);
  }

  @Override
  public String toString() {
    return "Contrato{" + "id=" + id + ", numeroContrato='" + numeroContrato + "'" + ", dataInicioVigencia='"
        + dataInicioVigencia + "'" + ", dataFimVigencia='" + dataFimVigencia + "'" + '}';
  }
}
