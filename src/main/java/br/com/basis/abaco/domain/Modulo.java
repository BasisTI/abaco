package br.com.basis.abaco.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Modulo.
 */
@Entity
@Table(name = "modulo")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "modulo")
public class Modulo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "nome", nullable = false)
    private String nome;

    @ManyToOne
    @JsonBackReference
    private Sistema sistema;

    @OneToMany(mappedBy = "modulo")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Funcionalidade> funcionalidades = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public Modulo nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Sistema getSistema() {
        return sistema;
    }

    public Modulo sistema(Sistema sistema) {
        this.sistema = sistema;
        return this;
    }

    public void setSistema(Sistema sistema) {
        this.sistema = sistema;
    }

    public Set<Funcionalidade> getFuncionalidades() {
        return funcionalidades;
    }

    public Modulo funcionalidades(Set<Funcionalidade> funcionalidades) {
        this.funcionalidades = funcionalidades;
        return this;
    }

    public Modulo addFuncionalidade(Funcionalidade funcionalidade) {
        this.funcionalidades.add(funcionalidade);
        funcionalidade.setModulo(this);
        return this;
    }

    public Modulo removeFuncionalidade(Funcionalidade funcionalidade) {
        this.funcionalidades.remove(funcionalidade);
        funcionalidade.setModulo(null);
        return this;
    }

    public void setFuncionalidades(Set<Funcionalidade> funcionalidades) {
        this.funcionalidades = funcionalidades;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Modulo modulo = (Modulo) o;
        if (modulo.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, modulo.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Modulo{" +
            "id=" + id +
            ", nome='" + nome + "'" +
            '}';
    }
}
