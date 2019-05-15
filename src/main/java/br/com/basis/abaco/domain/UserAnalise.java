package br.com.basis.abaco.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.DecimalMax;
import javax.validation.constraints.DecimalMin;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

/**
 * A EsforcoFase.
 */
@Entity
@Table(name = "user_analise")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "useranalise")
public class UserAnalise implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @ManyToOne
    @JsonBackReference
    private Analise analise_id;

    @ManyToOne
    private User user_id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Analise getAnalise() {
        return analise_id;
    }

    public UserAnalise analise(Analise analise) {
        this.analise_id = analise;
        return this;
    }

    public void setAnalise(Analise analise) {
        this.analise_id = analise;
    }

    public User getUser() {
        return user_id;
    }

    public void setUser(User user) {
        this.user_id = user;
    }

    public UserAnalise user(User user) {
        this.user_id = user;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        UserAnalise userAnalise = (UserAnalise) o;
        if (userAnalise.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, userAnalise.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "userAnalise{" + "analise_id=" + analise_id + ", user_id='" + user_id + "'" + '}';
    }
}
