package br.com.basis.abaco.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import java.io.Serializable;
import java.util.Objects;

/**
 * A Der.
 */
@Entity
@Table(name = "der")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "der")
public class Der implements Serializable {

    private static final long serialVersionUID = 1L;
    private final transient Logger log = LoggerFactory.getLogger(Der.class);

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "nome")
    @Field (index = FieldIndex.not_analyzed, type = FieldType.String)
    private String nome;

    private Integer valor;

    @ManyToOne
    private Rlr rlr;

    @JsonBackReference(value="funcaoDados")
    @ManyToOne
    private FuncaoDados funcaoDados;

    @JsonBackReference(value="funcaoTransacao")
    @ManyToOne
    private FuncaoTransacao funcaoTransacao;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public Der nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Rlr getRlr() {
        return rlr;
    }

    public Der rlr(Rlr rlr) {
        this.rlr = rlr;
        return this;
    }

    public void setRlr(Rlr rlr) {
        this.rlr = rlr;
    }

    public FuncaoDados getFuncaoDados() {
        return funcaoDados;
    }

    public void setFuncaoDados(FuncaoDados funcaoDados) {
        this.funcaoDados = funcaoDados;
    }

    public FuncaoTransacao getFuncaoTransacao() {
        try {
            if (funcaoTransacao == null) {
                return null;
            } else {
                return (FuncaoTransacao) funcaoTransacao.getClone();
            }
        } catch (CloneNotSupportedException e) {
            log.error(e.getMessage(), e);
            return null;
        }
    }

    public void setFuncaoTransacao(FuncaoTransacao funcaoTransacao) {
        try {
            if (funcaoTransacao == null) {
                this.funcaoTransacao = null;
            } else {
                this.funcaoTransacao = (FuncaoTransacao) funcaoTransacao.getClone();
            }
        } catch (CloneNotSupportedException e) {
            log.error(e.getMessage(), e);
            this.funcaoTransacao = null;
        }
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
        Der der = (Der) o;
        if (der.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, der.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Der{" + "id=" + id + ", nome='" + nome + "'" + '}';
    }
}
