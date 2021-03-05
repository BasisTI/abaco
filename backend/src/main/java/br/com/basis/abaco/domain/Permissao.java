package br.com.basis.abaco.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import java.io.Serializable;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Optional;
import java.util.Set;

/**
 * A Permissao.
 */
@Entity
@Table(name = "permissao")
@Document(indexName = "permissao")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Permissao implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "funcionalidade_abaco_id", nullable = false)
    private FuncionalidadeAbaco funcionalidadeAbaco;

    @ManyToOne
    @JoinColumn(name = "acao_id", nullable = false)
    private Acao acao;

    @ManyToMany(mappedBy = "permissaos")
    @JsonIgnore
    private Set<Perfil> perfils = new HashSet<>();


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FuncionalidadeAbaco getFuncionalidadeAbaco() {
        return funcionalidadeAbaco;
    }

    public void setFuncionalidadeAbaco(FuncionalidadeAbaco funcionalidadeAbaco) {
        this.funcionalidadeAbaco = funcionalidadeAbaco;
    }

    public Acao getAcao() {
        return acao;
    }

    public Permissao acao(Acao acao) {
        this.acao = acao;
        return this;
    }

    public void setAcao(Acao acao) {
        this.acao = acao;
    }

    public Set<Perfil> getPerfils() {
        return Optional.ofNullable(this.perfils)
            .map(lista -> new LinkedHashSet<Perfil>(lista))
            .orElse(new LinkedHashSet<Perfil>());
    }

    public Permissao addPerfil(Perfil perfil) {
        this.perfils.add(perfil);
        perfil.getPermissaos().add(this);
        return this;
    }

    public Permissao removePerfil(Perfil perfil) {
        this.perfils.remove(perfil);
        perfil.getPermissaos().remove(this);
        return this;
    }

    public void setPerfils(Set<Perfil> perfils) {
        this.perfils = Optional.ofNullable(perfils)
            .map(lista -> new LinkedHashSet<Perfil>(lista))
            .orElse(new LinkedHashSet<Perfil>());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Permissao)) {
            return false;
        }
        return id != null && id.equals(((Permissao) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Permissao{" +
            "id=" + getId() +
            "}";
    }
}
