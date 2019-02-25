package br.com.basis.abaco.domain;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;

@Entity
@Table(name = "manual_Contrato")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "manualContrato")
public class ManualContrato implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	@Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;
	
	@OneToOne(fetch=FetchType.EAGER)
	private Manual manual;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JsonBackReference
	private Contrato contratos;
	
    @Column(name = "data_inicio_vigencia")
    @JsonDeserialize(using = LocalDateDeserializer.class)
    private LocalDate dataInicioVigencia;

    @Column(name = "data_fim_vigencia")
    @JsonDeserialize(using = LocalDateDeserializer.class)
    private LocalDate dataFimVigencia;
    
    @NotNull
    @Column(name = "ativo", nullable = true)
    private Boolean ativo;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Manual getManual() {
		return manual;
	}

	public void setManual(Manual manual) {
		this.manual = manual;
	}

	public Contrato getContrato() {
		return contratos;
	}

	public void setContrato(Contrato contrato) {
		this.contratos = contrato;
	}

	public LocalDate getDataInicioVigencia() {
		return dataInicioVigencia;
	}

	public void setDataInicioVigencia(LocalDate dataInicioVigencia) {
		this.dataInicioVigencia = dataInicioVigencia;
	}

	public LocalDate getDataFimVigencia() {
		return dataFimVigencia;
	}

	public void setDataFimVigencia(LocalDate dataFimVigencia) {
		this.dataFimVigencia = dataFimVigencia;
	}

	public Boolean getAtivo() {
		return ativo;
	}

	public void setAtivo(Boolean ativo) {
		this.ativo = ativo;
	}
	
	@Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        ManualContrato manualContrato = (ManualContrato) o;
        if (manualContrato.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, manualContrato.id);
    }

	@Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
	
	@Override
    public String toString() {
		return "ManualContrato{id=" + id + ",dataInicioVigencia=1" + dataInicioVigencia + "',dataFimVigencia='" +
				dataFimVigencia + "',ativo=" + ativo;
	}
    

}
