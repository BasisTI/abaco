package br.com.basis.abaco.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.annotations.ApiModel;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * <Enter note text here>
 */
@ApiModel(description = "<Enter note text here>")
@Entity
@Table(name = "organizacao")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "organizacao")
public class Organizacao implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Size(max = 80)
    @Column(name = "nome", length = 80)
    private String nome;

    @Size(max = 19)
    @Pattern(regexp = "(^(\\d{2}.\\d{3}.\\d{3}/\\d{4}-\\d{2})|(\\d{14})$)")
    @Column(name = "cnpj", length = 19)
    private String cnpj;

    @NotNull
    @Column(name = "ativo", nullable = false)
    private Boolean ativo;

    @Column(name = "numero_ocorrencia")
    private String numeroOcorrencia;


    @OneToMany(mappedBy = "organizacao")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Sistema> sistemas = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public Organizacao nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCnpj() {
        return cnpj;
    }

    public Organizacao cnpj(String cnpj) {
        this.cnpj = cnpj;
        return this;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public Boolean isAtivo() {
        return ativo;
    }

    public Organizacao ativo(Boolean ativo) {
        this.ativo = ativo;
        return this;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public String getNumeroOcorrencia() {
        return numeroOcorrencia;
    }

    public Organizacao numeroOcorrencia(String numeroOcorrencia) {
        this.numeroOcorrencia = numeroOcorrencia;
        return this;
    }

    public void setNumeroOcorrencia(String numeroOcorrencia) {
        this.numeroOcorrencia = numeroOcorrencia;
    }


    public Set<Sistema> getSistemas() {
        return sistemas;
    }

    public Organizacao sistemas(Set<Sistema> sistemas) {
        this.sistemas = sistemas;
        return this;
    }

    public Organizacao addSistema(Sistema sistema) {
        this.sistemas.add(sistema);
        sistema.setOrganizacao(this);
        return this;
    }

    public Organizacao removeSistema(Sistema sistema) {
        this.sistemas.remove(sistema);
        sistema.setOrganizacao(null);
        return this;
    }

    public void setSistemas(Set<Sistema> sistemas) {
        this.sistemas = sistemas;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Organizacao organizacao = (Organizacao) o;
        if (organizacao.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, organizacao.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Organizacao{" +
            "id=" + id +
            ", nome='" + nome + "'" +
            ", cnpj='" + cnpj + "'" +
            ", ativo='" + ativo + "'" +
            ", numeroOcorrencia='" + numeroOcorrencia + "'" +
            '}';
    }
}
