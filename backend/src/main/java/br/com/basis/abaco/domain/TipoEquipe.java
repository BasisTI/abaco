package br.com.basis.abaco.domain;

import br.com.basis.dynamicexports.pojo.ReportObject;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.validator.constraints.Email;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldIndex;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "tipo_equipe")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "tipo_equipe")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TipoEquipe implements Serializable, ReportObject {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "nome", nullable = false, unique = true)
    @Field(index = FieldIndex.not_analyzed, type = FieldType.String)
    private String nome;

    @Column(name = "preposto", nullable = false, unique = true)
    @Field(index = FieldIndex.not_analyzed, type = FieldType.String)
    private String preposto;

    @Email
    @Size(max = 100)
    @Column(name = "email_preposto", nullable = false )
    @Field(index = FieldIndex.not_analyzed, type = FieldType.String)
    private String emailPreposto;


    @Field(type = FieldType.Nested, index = FieldIndex.not_analyzed)
    @JsonInclude
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "tipoequipe_organizacao", joinColumns = @JoinColumn(name = "tipoequipe_id", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "organizacao_id", referencedColumnName = "id"))
    private Set<Organizacao> organizacoes = new HashSet<>();

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User cfpsResponsavel;

    @JsonIgnore
    @ManyToMany(mappedBy = "tipoEquipes")
    private Set<User> usuarios = new HashSet<>();

    public String getNomeOrg(){
        String ponto = ". ";
        String nomeOrg = "";

        if (organizacoes != null) {
            for(Organizacao org : organizacoes){
                nomeOrg = nomeOrg.concat(org.getNome()).concat(ponto);
            }
        }

        return nomeOrg;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        TipoEquipe other = (TipoEquipe) obj;
        if (id == null) {
            if (other.id != null) {
                return false;
            }
        } else if (!id.equals(other.id)) {
            return false;
        }
        return true;
    }
}
