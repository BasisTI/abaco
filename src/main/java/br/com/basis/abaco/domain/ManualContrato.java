package br.com.basis.abaco.domain;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonBackReference;

import com.fasterxml.jackson.annotation.JsonIgnore;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import org.springframework.data.elasticsearch.annotations.Document;

/**
 * Entidade que que permite a relação entre Contrato e Manual.
 * <p>
 * Cada Contrato deve poder possui mais de um manual com uma <br>
 * data de início, fim e se está ativo para o Contrato.
 * 
 * @author davy
 *
 */
@Entity
@Table(name = "manual_Contrato")
@Document(indexName = "manualcontrato")
public class ManualContrato implements Serializable {

  private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
  @SequenceGenerator(name = "sequenceGenerator")
  private Long id;

  @ManyToOne
  private Manual manual;

  @JsonBackReference
  @ManyToOne(fetch = FetchType.LAZY)
  private Contrato contratos;

  @Column(name = "data_inicio_vigencia")
  @JsonDeserialize(using = LocalDateDeserializer.class)
  private LocalDate dataInicioVigencia;

  @Column(name = "data_fim_vigencia")
  @JsonDeserialize(using = LocalDateDeserializer.class)
  private LocalDate dataFimVigencia;

  @NotNull
  @Column(name = "ativo")
  private Boolean ativo;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Manual getManual() {
    return this.manual;
  }

  public void setManual(Manual manual) {
    this.manual = manual;
  }

  @JsonIgnore
  public Contrato getContrato() {
    return this.contratos;
  }

  public void setContrato(Contrato contrato) {
    this.contratos = contrato;
  }

  public LocalDate getDataInicioVigencia() {
    return this.dataInicioVigencia;
  }

  public void setDataInicioVigencia(LocalDate dataInicioVigencia) {
    this.dataInicioVigencia = dataInicioVigencia;
  }

  public LocalDate getDataFimVigencia() {
    return this.dataFimVigencia;
  }

  public void setDataFimVigencia(LocalDate dataFimVigencia) {
    this.dataFimVigencia = dataFimVigencia;
  }

  public Boolean getAtivo() {
    return ativo;
  }

  public void setAtivo(Boolean ativo) {
    this.ativo = ativo;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ManualContrato manualContrato = (ManualContrato) o;
    if (manualContrato.id == null || id == null) {
      return false;
    }
    return Objects.equals(getId(), manualContrato.getId());
  }

  @Override
  public int hashCode() {
    return Objects.hashCode(id);
  }

  @Override
  public String toString() {
    return "ManualContrato{id=" + id + ",dataInicioVigencia='" + dataInicioVigencia + "',dataFimVigencia='"
        + dataFimVigencia + "',ativo='" + ativo + "'";
  }

}
