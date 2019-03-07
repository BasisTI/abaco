package br.com.basis.abaco.domain;

import br.com.basis.dynamicexports.pojo.ReportObject;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.swagger.annotations.ApiModel;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.validator.constraints.br.CNPJ;
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
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Collections;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * <Enter note text here>
 */
@ApiModel(description = "<Enter note text here>")
@Entity
@Table(name = "organizacao")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "organizacao")
public class Organizacao implements Serializable, ReportObject {

  private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
  @SequenceGenerator(name = "sequenceGenerator")
  private Long id;

  @Size(max = 80)
  @Column(name = "nome", length = 80)
  @Field (index = FieldIndex.not_analyzed, type = FieldType.String)
  private String nome;

  @Size(max = 19)
  @Column(name = "cnpj", length = 14)
  @CNPJ(message = "CNPJ inválido")
  @Field(type = FieldType.String, index = FieldIndex.not_analyzed)
  private String cnpj;

  @NotNull
  @Column(name = "ativo", nullable = false)
  private Boolean ativo;

  @Column(name = "numero_ocorrencia")
  private String numeroOcorrencia;

  @OneToMany(mappedBy = "organizacao", fetch = FetchType.EAGER)
  @JsonIgnore
  @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
  private Set<Sistema> sistemas = new HashSet<>();

  @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
  @JsonManagedReference
  private Set<Contrato> contracts = new HashSet<>();

  @JsonIgnore
  @ManyToMany(mappedBy = "organizacoes", fetch = FetchType.EAGER)
  private Set<TipoEquipe> tipoEquipe = new HashSet<>();

  @Size(max = 255)
  @Column(name = "sigla")
  @Field(type = FieldType.String, index = FieldIndex.not_analyzed)
  private String sigla;

  @Column(name="logo_id")
  private Long logoId;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getNome() {
    return nome;
  }

  public Organizacao nome(String nome) {
    this.nome = nome;
    return this;
  }

  public void setNome(String nome) {
    this.nome = nome;
  }

  public String getCnpj() {
    return cnpj;
  }

  public Organizacao cnpj(String cnpj) {
    this.cnpj = cnpj;
    return this;
  }

  public void setCnpj(String cnpj) {
    this.cnpj = cnpj;
  }

  public Boolean getAtivo() {
    return ativo;
  }

  public String getAtivoString() {
    if (getAtivo()) {
      return "Sim";
    }
    return "Não";
  }

  public Organizacao ativo(Boolean ativo) {
    this.ativo = ativo;
    return this;
  }

  public void setAtivo(Boolean ativo) {
    this.ativo = ativo;
  }

  public String getNumeroOcorrencia() {
    return numeroOcorrencia;
  }

  public Organizacao numeroOcorrencia(String numeroOcorrencia) {
    this.numeroOcorrencia = numeroOcorrencia;
    return this;
  }

  public void setNumeroOcorrencia(String numeroOcorrencia) {
    this.numeroOcorrencia = numeroOcorrencia;
  }

  public Set<Sistema> getSistemas() {
    return sistemas;
  }

  public Organizacao sistemas(Set<Sistema> sistemas) {
    this.sistemas = sistemas;
    return this;
  }

  public Organizacao addSistema(Sistema sistema) {
    this.sistemas.add(sistema);
    sistema.setOrganizacao(this);
    return this;
  }

  public Organizacao removeSistema(Sistema sistema) {
    this.sistemas.remove(sistema);
    sistema.setOrganizacao(null);
    return this;
  }

  public void setSistemas(Set<Sistema> sistemas) {
    this.sistemas = sistemas;
  }

  public String getSigla() {
    return sigla;
  }

  public Organizacao sigla(String sigla) {
    this.sigla = sigla;
    return this;
  }

  public void setSigla(String sigla) {
    this.sigla = sigla;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Organizacao organizacao = (Organizacao) o;
    if (organizacao.id == null || id == null) {
      return false;
    }
    return Objects.equals(id, organizacao.id);
  }

  public Set<Contrato> getContracts() {
    return contracts;
  }

  public void setContracts(Set<Contrato> contracts) {
    this.contracts = contracts;
  }

  public Long getLogoId() {
    return logoId;
  }

  public void setLogoId(Long logoId) {
    this.logoId = logoId;
  }

  public Set<TipoEquipe> getTipoEquipe() {
    return Collections.unmodifiableSet(tipoEquipe);
  }

  public void setTipoEquipe(Set<TipoEquipe> tipoEquipe) {
    this.tipoEquipe = new HashSet<>(tipoEquipe);
  }

  @Override
  public int hashCode() {
    return Objects.hashCode(id);
  }

  @Override
  public String toString() {
    return "Organizacao{" + "id=" + id + ", nome='" + nome + "'" + ", cnpj='" + cnpj + "'" + ", ativo='" + ativo
        + "'" + ", numeroOcorrencia='" + numeroOcorrencia + "'" + '}';
  }
}
