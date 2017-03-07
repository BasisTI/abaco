package br.com.basis.abaco.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

import br.com.basis.abaco.domain.enumeration.TipoFatorAjuste;

import br.com.basis.abaco.domain.enumeration.ImpactoFatorAjuste;

/**
 * A FatorAjuste.
 */
@Entity
@Table(name = "fator_ajuste")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "fatorajuste")
public class FatorAjuste implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "nome", nullable = false)
    private String nome;

    @NotNull
    @Column(name = "fator", precision=10, scale=2, nullable = false)
    private BigDecimal fator;

    @NotNull
    @Column(name = "ativo", nullable = false)
    private Boolean ativo;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_ajuste")
    private TipoFatorAjuste tipoAjuste;

    @Enumerated(EnumType.STRING)
    @Column(name = "impacto")
    private ImpactoFatorAjuste impacto;

    @ManyToOne
    private Manual manual;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public FatorAjuste nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public BigDecimal getFator() {
        return fator;
    }

    public FatorAjuste fator(BigDecimal fator) {
        this.fator = fator;
        return this;
    }

    public void setFator(BigDecimal fator) {
        this.fator = fator;
    }

    public Boolean isAtivo() {
        return ativo;
    }

    public FatorAjuste ativo(Boolean ativo) {
        this.ativo = ativo;
        return this;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public TipoFatorAjuste getTipoAjuste() {
        return tipoAjuste;
    }

    public FatorAjuste tipoAjuste(TipoFatorAjuste tipoAjuste) {
        this.tipoAjuste = tipoAjuste;
        return this;
    }

    public void setTipoAjuste(TipoFatorAjuste tipoAjuste) {
        this.tipoAjuste = tipoAjuste;
    }

    public ImpactoFatorAjuste getImpacto() {
        return impacto;
    }

    public FatorAjuste impacto(ImpactoFatorAjuste impacto) {
        this.impacto = impacto;
        return this;
    }

    public void setImpacto(ImpactoFatorAjuste impacto) {
        this.impacto = impacto;
    }

    public Manual getManual() {
        return manual;
    }

    public FatorAjuste manual(Manual manual) {
        this.manual = manual;
        return this;
    }

    public void setManual(Manual manual) {
        this.manual = manual;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        FatorAjuste fatorAjuste = (FatorAjuste) o;
        if (fatorAjuste.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, fatorAjuste.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "FatorAjuste{" +
            "id=" + id +
            ", nome='" + nome + "'" +
            ", fator='" + fator + "'" +
            ", ativo='" + ativo + "'" +
            ", tipoAjuste='" + tipoAjuste + "'" +
            ", impacto='" + impacto + "'" +
            '}';
    }
}
