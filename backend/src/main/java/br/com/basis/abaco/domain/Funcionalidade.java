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

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OrderBy;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;
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
    @JsonBackReference
    private Modulo modulo;

    @ManyToOne
    @JsonIgnore
    @OrderBy("name ASC, id ASC")
    private FuncaoDados funcaoDados;

    @Transient
    @JsonIgnore
    private Set<FuncaoDados> funcoesDados = new HashSet<>();

    @ManyToOne
    @JsonIgnore
    @OrderBy("name ASC, id ASC")
    private FuncaoTransacao funcaoTransacao;

    @Transient
    @JsonIgnore
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

    public FuncaoDados getFuncaoDados() {
        return funcaoDados;
    }

    public Funcionalidade funcaoDados(FuncaoDados funcaoDados) {
        this.funcaoDados = funcaoDados;
        return this;
    }

    public void setFuncaoDados(FuncaoDados funcaoDados) {
        this.funcaoDados = funcaoDados;
    }

    public FuncaoTransacao getFuncaoTransacao() {
        return funcaoTransacao;
    }

    public Funcionalidade funcaoTransacao(FuncaoTransacao funcaoTransacao) {
        this.funcaoTransacao = funcaoTransacao;
        return this;
    }

    public void setFuncaoTransacao(FuncaoTransacao funcaoTransacao) {
        this.funcaoTransacao = funcaoTransacao;
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
