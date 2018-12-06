package br.com.basis.abaco.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

/**
 * @author eduardo.andrade
 * @since 28/03/2018
 */
@Entity
@Table(name = "impacto")
public class Impacto implements Serializable {

	private static final long serialVersionUID = -761523812287216815L;

	@Id
	@Column(name="id")
	private Long id;
	
    @Column(name = "descricao", unique=true)
	private String descricao;

    
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}

}
