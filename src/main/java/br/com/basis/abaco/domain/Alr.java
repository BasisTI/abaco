package br.com.basis.abaco.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import java.io.Serializable;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A Alr.
 */
@Entity
@Table(name = "alr")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "alr")
public class Alr implements Serializable {

    private static final long serialVersionUID = 1L;
    private transient Logger log = LoggerFactory.getLogger(Alr.class);

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "nome")
    @Field (index = FieldIndex.not_analyzed, type = FieldType.String)
    private String nome;

    private Integer valor;

    @JsonBackReference(value = "funcaoTransacao")
    @ManyToOne
    private FuncaoTransacao funcaoTransacao;

    @OneToMany(mappedBy = "alr")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<FuncaoDados> funcaoDados = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FuncaoTransacao getFuncaoTransacao() {
        return funcaoTransacao;
    }

    public Alr funcaoTransacao(FuncaoTransacao funcaoTransacao) {
        try {
            if(funcaoTransacao != null) {
                this.funcaoTransacao = (FuncaoTransacao) funcaoTransacao.getClone();
            } else {
                this.funcaoTransacao = null;
            }
        } catch (CloneNotSupportedException e) {
            log.error(e.getMessage(), e);
            this.funcaoTransacao = null;
        }
        return this;
    }

    public void setFuncaoTransacao(FuncaoTransacao funcaoTransacao) {
        try {
            if(funcaoTransacao != null) {
                this.funcaoTransacao = (FuncaoTransacao) funcaoTransacao.getClone();
            } else {
                this.funcaoTransacao = null;
            }
        } catch (CloneNotSupportedException e) {
            log.error(e.getMessage(), e);
            this.funcaoTransacao = null;
        }
    }

    public Set<FuncaoDados> getFuncaoDados() {
        if (funcaoDados == null){
            return null;
        }
        Set<FuncaoDados> cp = new LinkedHashSet<>();
        cp.addAll(funcaoDados);
        return cp;
    }

    public Alr funcaoDados(Set<FuncaoDados> funcaoDados) {
        if (funcaoDados == null){
            this.funcaoDados = null;
        }else {
            Set<FuncaoDados> cp = new LinkedHashSet<>();
            cp.addAll(funcaoDados);
            this.funcaoDados = cp;
        }
        return this;
    }

    public Alr addFuncaoDados(FuncaoDados funcaoDados) {
        if (funcaoDados == null){
            return this;
        }else {
            this.funcaoDados.add(funcaoDados);
            funcaoDados.setAlr(this);
        }
        return this;
    }

    public Alr removeFuncaoDados(FuncaoDados funcaoDados) {
        if (funcaoDados == null){
            return this;
        }
        this.funcaoDados.remove(funcaoDados);
        funcaoDados.setAlr(null);
        return this;
    }

    public void setFuncaoDados(Set<FuncaoDados> funcaoDados) {
        if (funcaoDados == null) {
            this.funcaoDados = null;
        } else {
            Set<FuncaoDados> cp = new LinkedHashSet<>();
            cp.addAll(funcaoDados);
            this.funcaoDados = cp;
        }
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Integer getValor() {
        return valor;
    }

    public void setValor(Integer valor) {
        this.valor = valor;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Alr alr = (Alr) o;
        if (alr.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, alr.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Alr{" + "id=" + id + '}';
    }
}
