package br.com.basis.abaco.domain;


import br.com.basis.dynamicexports.pojo.ReportObject;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Optional;
import java.util.Set;

/**
 * A Perfil.
 */
@Entity
@Table(name = "perfil")
@Document(indexName = "perfil")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Perfil implements Serializable, ReportObject {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "nome", nullable = false)
    private String nome;

    @NotNull
    @Column(name = "descricao", nullable = false)
    private String descricao;

    @Column(name = "flg_ativo")
    private Boolean flgAtivo;

    @ManyToMany
    @JoinTable(name = "perfil_permissao",
               joinColumns = @JoinColumn(name = "perfil_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "permissao_id", referencedColumnName = "id"))
    private Set<Permissao> permissaos = new HashSet<>();

    @ManyToMany(mappedBy = "perfils")
    @JsonIgnore
    private Set<User> users = new HashSet<>();

    public String getAtivo(){
        return flgAtivo ? "Sim" : "Não";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public Perfil nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public Perfil descricao(String descricao) {
        this.descricao = descricao;
        return this;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Boolean isFlgAtivo() {
        return flgAtivo;
    }

    public Perfil flgAtivo(Boolean flgAtivo) {
        this.flgAtivo = flgAtivo;
        return this;
    }

    public void setFlgAtivo(Boolean flgAtivo) {
        this.flgAtivo = flgAtivo;
    }

    public Set<Permissao> getPermissaos() {
        return Optional.ofNullable(this.permissaos)
            .map(lista -> new LinkedHashSet<Permissao>(lista))
            .orElse(new LinkedHashSet<Permissao>());
    }

    public void setPermissaos(Set<Permissao> permissaos) {
        this.permissaos = Optional.ofNullable(permissaos)
            .map(lista -> new LinkedHashSet<Permissao>(lista))
            .orElse(new LinkedHashSet<Permissao>());
    }

    public Perfil addPermissao(Permissao permissao) {
        this.permissaos.add(permissao);
        permissao.getPerfils().add(this);
        return this;
    }

    public Perfil removePermissao(Permissao permissao) {
        this.permissaos.remove(permissao);
        permissao.getPerfils().remove(this);
        return this;
    }

    public Set<User> getUsers() {
        return Optional.ofNullable(this.users)
            .map(lista -> new LinkedHashSet<User>(lista))
            .orElse(new LinkedHashSet<User>());
    }

    public void setUsers(Set<User> users) {
        this.users = Optional.ofNullable(users)
            .map(lista -> new LinkedHashSet<User>(lista))
            .orElse(new LinkedHashSet<User>());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Perfil)) {
            return false;
        }
        return id != null && id.equals(((Perfil) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Perfil{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", descricao='" + getDescricao() + "'" +
            ", flgAtivo='" + isFlgAtivo() + "'" +
            "}";
    }
}
