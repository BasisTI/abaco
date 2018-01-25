package br.com.basis.abaco.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

/**
 * A EsforcoFase.
 */
@Entity
@Table(name = "esforco_fase")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "esforcofase")
public class EsforcoFase implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "esforco", precision = 10, scale = 2)
    private BigDecimal esforco;

    @ManyToOne
    @JsonBackReference
    private Manual manual;

    @ManyToOne
    private Fase fase;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getEsforco() {
        return esforco;
    }

    public EsforcoFase esforco(BigDecimal esforco) {
        this.esforco = esforco;
        return this;
    }

    public void setEsforco(BigDecimal esforco) {
        this.esforco = esforco;
    }

    public Manual getManual() {
        return manual;
    }

    public EsforcoFase manual(Manual manual) {
        this.manual = manual;
        return this;
    }

    public void setManual(Manual manual) {
        this.manual = manual;
    }

    public TipoFase getFase() {
		return fase;
	}

	public void setFase(TipoFase fase) {
		this.fase = fase;
	}

	public EsforcoFase fase(TipoFase fase) {
        this.fase = fase;
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
        EsforcoFase esforcoFase = (EsforcoFase) o;
        if (esforcoFase.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, esforcoFase.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "EsforcoFase{" +
            "id=" + id +
            ", esforco='" + esforco + "'" +
            '}';
    }
}
