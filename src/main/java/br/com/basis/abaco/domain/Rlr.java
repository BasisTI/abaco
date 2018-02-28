package br.com.basis.abaco.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A Rlr.
 */
@Entity
@Table(name = "rlr")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "rlr")
public class Rlr implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "nome", nullable = false)
    private String nome;

    @OneToMany(mappedBy = "rlr")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Der> ders = new HashSet<>();

    @ManyToOne
    @JsonBackReference(value="funcaoDados")
    private FuncaoDados funcaoDados;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public Rlr nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Set<Der> getDers() {
        return ders;
    }

    public Rlr ders(Set<Der> ders) {
        this.ders = ders;
        return this;
    }

    public Rlr addDer(Der der) {
        this.ders.add(der);
        der.setRlr(this);
        return this;
    }

    public Rlr removeDer(Der der) {
        this.ders.remove(der);
        der.setRlr(null);
        return this;
    }

    public void setDers(Set<Der> ders) {
        this.ders = ders;
    }

    public FuncaoDados getFuncaoDados() {
        return funcaoDados;
    }

    public Rlr funcaoDados(FuncaoDados funcaoDados) {
        this.funcaoDados = funcaoDados;
        return this;
    }

    public void setFuncaoDados(FuncaoDados funcaoDados) {
        this.funcaoDados = funcaoDados;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Rlr rlr = (Rlr) o;
        if (rlr.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, rlr.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Rlr{" +
            "id=" + id +
            ", nome='" + nome + "'" +
            '}';
    }
}
