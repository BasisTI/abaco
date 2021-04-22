package br.com.basis.abaco.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldIndex;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

/**
 * A Funcionalidade.
 */
@Entity
@Table(name = "funcionalidade")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "funcionalidade")
@AllArgsConstructor
@NoArgsConstructor
public class Funcionalidade implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "nome", nullable = false)
    @Field(index = FieldIndex.not_analyzed, type = FieldType.String)
    private String nome;

    @ManyToOne
    @JsonIgnore
    private Modulo modulo;


    @JsonIgnore
    @Transient
    private Set<FuncaoDados> funcoesDados = new HashSet<>();


    @JsonIgnore
    @Transient
    private Set<FuncaoTransacao> funcoesTransacao = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public Funcionalidade nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Modulo getModulo() {
        return modulo;
    }

    public Funcionalidade modulo(Modulo modulo) {
        this.modulo = modulo;
        return this;
    }

    public void setModulo(Modulo modulo) {
        this.modulo = modulo;
    }



    public Set<FuncaoDados> getFuncoesDados() {
        return Optional.ofNullable(funcoesDados)
            .map(LinkedHashSet::new)
            .orElse(new LinkedHashSet<>());
    }

    public void setFuncoesDados(Set<FuncaoDados> funcoesDados) {
        this.funcoesDados = Optional.ofNullable(funcoesDados)
            .map(LinkedHashSet::new)
            .orElse(new LinkedHashSet<>());
    }

    public Set<FuncaoTransacao> getFuncoesTransacao() {
        return Optional.ofNullable(funcoesTransacao)
            .map(LinkedHashSet::new)
            .orElse(new LinkedHashSet<>());
    }

    public void setFuncoesTransacao(Set<FuncaoTransacao> funcoesTransacao) {
        this.funcoesTransacao = Optional.ofNullable(funcoesTransacao)
            .map(LinkedHashSet::new)
            .orElse(new LinkedHashSet<>());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Funcionalidade funcionalidade = (Funcionalidade) o;
        if (funcionalidade.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, funcionalidade.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Funcionalidade{" + "id=" + id + ", nome='" + nome + "'" + '}';
    }
}
