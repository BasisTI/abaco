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
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Objects;

/**
 * A Funcionalidade.
 */
@Entity
@Table(name = "funcionalidade")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "funcionalidade")
public class Funcionalidade implements Serializable {

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
	private Modulo modulo;

	@ManyToOne
	@JsonIgnore
	private FuncaoDados funcaoDados;

	@ManyToOne
	@JsonIgnore
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
