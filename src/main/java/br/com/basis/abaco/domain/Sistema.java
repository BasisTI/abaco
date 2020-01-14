package br.com.basis.abaco.domain;

import br.com.basis.abaco.domain.enumeration.TipoSistema;
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
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import static java.util.Collections.unmodifiableSet;

@Entity
@Table(name = "sistema")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "sistema")
public class Sistema implements Serializable, ReportObject {

    private static final long serialVersionUID = 1L;
    private static final String SISTEMA = "sistema";

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Size(max = 255)
    @Column(name = "sigla", length = 255)
    private String sigla;

    @NotNull
    @Column(name = "nome", nullable = false)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_sistema")
    private TipoSistema tipoSistema;

    @Column(name = "numero_ocorrencia")
    @Field(index = FieldIndex.not_analyzed, type = FieldType.String)
    private String numeroOcorrencia;

    @ManyToOne
    @JoinColumn(name = "organizacao_id")
    private Organizacao organizacao;

    @OneToMany(mappedBy = SISTEMA, cascade = CascadeType.ALL, orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Modulo> modulos = new HashSet<>();

    @OneToMany(mappedBy = SISTEMA)
    private Set<Analise> analises = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSigla() {
        return sigla;
    }

    public Sistema sigla(String sigla) {
        this.sigla = sigla;
        return this;
    }

    public void setSigla(String sigla) {
        this.sigla = sigla;
    }

    public String getNome() {
        return nome;
    }

    public Sistema nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public TipoSistema getTipoSistema() {
        return tipoSistema;
    }

    public void setTipoSistema(TipoSistema tipoSistema) {
        this.tipoSistema = tipoSistema;
    }

    public String getNumeroOcorrencia() {
        return numeroOcorrencia;
    }

    public Sistema numeroOcorrencia(String numeroOcorrencia) {
        this.numeroOcorrencia = numeroOcorrencia;
        return this;
    }

    public void setNumeroOcorrencia(String numeroOcorrencia) {
        this.numeroOcorrencia = numeroOcorrencia;
    }

    public Organizacao getOrganizacao() {
        return organizacao;
    }

    public String getNomeOrg() {
        return organizacao.getNome();
    }

    public Sistema organizacao(Organizacao organizacao) {
        this.organizacao = organizacao;
        return this;
    }

    public void setOrganizacao(Organizacao organizacao) {
        this.organizacao = organizacao;
    }

    public Set<Modulo> getModulos() {
        return Optional.ofNullable(this.modulos)
                .map(lista -> new LinkedHashSet<Modulo>(lista))
                .orElse(new LinkedHashSet<Modulo>());
    }

    public Sistema modulos(Set<Modulo> modulos) {
        this.modulos = Optional.ofNullable(modulos)
                .map(lista -> new LinkedHashSet<Modulo>(lista))
                .orElse(new LinkedHashSet<Modulo>());
        return this;
    }

    public Sistema addModulo(Modulo modulo) {
        if (modulo == null) {
            return this;
        }
        this.modulos.add(modulo);
        modulo.setSistema(this);
        return this;
    }

    public Sistema removeModulo(Modulo modulo) {
        if (modulo == null) {
            return this;
        }
        this.modulos.remove(modulo);
        modulo.setSistema(null);
        return this;
    }

    public void setModulos(Set<Modulo> modulos) {
        this.modulos = Optional.ofNullable(modulos)
                .map(lista -> new LinkedHashSet<Modulo>(lista))
                .orElse(new LinkedHashSet<Modulo>());
    }

    public Set<Analise> getAnalises() {
        return unmodifiableSet(analises);
    }

    public void setAnalises(Set<Analise> analises) {
        this.analises = unmodifiableSet(analises);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Sistema sistema = (Sistema) o;
        if (sistema.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, sistema.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Sistema{" + "id=" + id + ", sigla='" + sigla + "'" + ", nome='" + nome + "'" + ", numeroOcorrencia='"
                + numeroOcorrencia + "'" + '}';
    }
}
