package br.com.basis.abaco.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldIndex;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Objects;

@Entity
@Table(name = "vw_rlr")
@Document(indexName = "vw_rlr")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VwRlr {

    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "nome")
    @Field(index = FieldIndex.not_analyzed, type = FieldType.String)
    private String nome;

    @Column(name = "id_sistema")
    private Long idSistema;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        VwRlr vwRlr = (VwRlr) o;
        if(vwRlr.nome == null || nome == null) {
            return false;
        }
        if(Objects.equals(nome, vwRlr.nome)){
            if(vwRlr.idSistema != null && idSistema != null){
                return Objects.equals(idSistema, vwRlr.idSistema);
            }
        }
        return false;
    }

    @Override
    public int hashCode() {
        return Objects.hash(nome, idSistema);
    }
}
