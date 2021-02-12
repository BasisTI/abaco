package br.com.basis.abaco.domain;

import br.com.basis.abaco.domain.enumeration.TipoSistema;
import br.com.basis.dynamicexports.pojo.ReportObject;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Getter;
import lombok.Setter;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldIndex;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "sistema")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "sistema")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Sistema implements Serializable, ReportObject {

    private static final long serialVersionUID = 1L;
    private static final String SISTEMA = "sistema";

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Size(max = 255)
    @Column(name = "sigla", length = 255)
    private String sigla;

    @NotNull
    @Column(name = "nome", nullable = false)
    @Field(index = FieldIndex.not_analyzed, type = FieldType.String)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_sistema")
    private TipoSistema tipoSistema;

    @Column(name = "numero_ocorrencia")
    @Field(index = FieldIndex.not_analyzed, type = FieldType.String)
    private String numeroOcorrencia;

    @Transient
    @JsonSerialize
    @Field(index = FieldIndex.not_analyzed, type = FieldType.String)
    private String nomeSearch;

    @Transient
    @JsonSerialize
    @Field(index = FieldIndex.not_analyzed, type = FieldType.String)
    private String numeroOcorrenciaSearch;

    @Transient
    @JsonSerialize
    @Field(index = FieldIndex.not_analyzed, type = FieldType.String)
    private String siglaSearch;


    @ManyToOne
    @JoinColumn(name = "organizacao_id")
    private Organizacao organizacao;

    @OneToMany(mappedBy = SISTEMA, cascade = CascadeType.ALL, orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Modulo> modulos = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = SISTEMA)
    private Set<Analise> analises = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Sistema sistema = (Sistema) o;
        if (sistema.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, sistema.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Sistema{" + "id=" + id + ", sigla='" + sigla + "'" + ", nome='" + nome + "'" + ", numeroOcorrencia='"
                + numeroOcorrencia + "'" + '}';
    }
}
