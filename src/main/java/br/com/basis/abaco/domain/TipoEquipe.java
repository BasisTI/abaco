package br.com.basis.abaco.domain;

import br.com.basis.dynamicexports.pojo.ReportObject;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldIndex;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
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
import java.util.Collections;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A TipoEquipe.
 */
@Entity
@Table(name = "tipo_equipe")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "tipoequipe")
public class TipoEquipe implements Serializable, ReportObject {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "nome", nullable = false, unique = true)
    @Field (index = FieldIndex.not_analyzed, type = FieldType.String)
    private String nome;

    @ManyToMany(fetch = FetchType.EAGER,cascade = CascadeType.MERGE)
    @JoinTable(name = "tipoequipe_organizacao", joinColumns = @JoinColumn(name = "tipoequipe_id", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "organizacao_id", referencedColumnName = "id"))
    private Set<Organizacao> organizacoes = new HashSet<>();

    @ManyToMany(mappedBy = "tipoEquipes")
    private Set<User> usuarios = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not
    // remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public TipoEquipe nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and
    // setters here, do not remove

    public Set<Organizacao> getOrganizacoes() {
        return Collections.unmodifiableSet(organizacoes);
    }

    public void setOrganizacoes(Set<Organizacao> orgs) {
        this.organizacoes = new HashSet<>(orgs);
    }

    public Set<User> getUsuarios() {
        Set<User> userAux;
        userAux = usuarios;
        return userAux;
    }

    public void setUsuarios(Set<User> usuarios) {
        Set<User> userAux;
        userAux = usuarios;
        this.usuarios = userAux;
    }

    public String getNomeOrg(){
        String ponto = ". ";
        String nomeOrg = "";

        for(Organizacao org : organizacoes){
            nomeOrg = nomeOrg.concat(org.getNome()).concat(ponto);
        }

        return nomeOrg;
    }



    @Override
    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (null == obj || getClass() != obj.getClass()) {
            return false;
        }
        TipoEquipe tipoEquipe = (TipoEquipe) obj;
        if (tipoEquipe.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), tipoEquipe.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "TipoEquipe{" + "id=" + getId() + ", nome='" + getNome() + "'" + "}";
    }
}
