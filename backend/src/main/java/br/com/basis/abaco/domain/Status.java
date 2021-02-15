package br.com.basis.abaco.domain;

import br.com.basis.dynamicexports.pojo.ReportObject;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.BooleanUtils;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldIndex;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

/**
 * A Status Analise.
 */
@Entity
@Table(name = "status_analise")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "status_analise")
@AllArgsConstructor
@NoArgsConstructor
public class Status implements Serializable, ReportObject {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "nome", unique=true)
    @Field(index = FieldIndex.not_analyzed, type = FieldType.String)
    private String nome;

    @NotNull
    @Column(name = "ativo", nullable = false)
    private Boolean ativo;

    @NotNull
    @Column(name = "divergencia", nullable = false)
    private Boolean divergencia;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public String getAtivoString() {
        if (BooleanUtils.isTrue(getAtivo())) {
            return "Sim";
        }
        return "Não";
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public Boolean getDivergencia() {
        return divergencia;
    }

    public String getDivergenciaString() {
        if (BooleanUtils.isTrue(getDivergencia())) {
            return "Sim";
        }
        return "Não";
    }

    public void setDivergencia(Boolean divergencia) {
        this.divergencia = divergencia;
    }

    @Override
    public String toString() {
        return "Status{" +
            "id=" + id +
            ", nome='" + nome + '\'' +
            ", ativo=" + ativo +
            ", divergencia=" + divergencia +
            '}';
    }
}
