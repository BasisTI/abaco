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
@Table(name = "vw_alr")
@Document(indexName = "vw_alr")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VwAlr {

    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "id_sistema")
    private Long idSistema;

    @Column(name = "nome")
    @Field(index = FieldIndex.not_analyzed, type = FieldType.String)
    private String nome;

    @Override
    public boolean equals(Object o) {
        if (this == o){
            return true;
        }
        if (o == null || getClass() != o.getClass()){
            return false;
        }
        VwAlr vwAlr = (VwAlr) o;
        if(vwAlr.nome == null || nome == null) {
            return false;
        }
        if(Objects.equals(nome, vwAlr.nome) && vwAlr.idSistema != null && idSistema != null){
            return Objects.equals(idSistema, vwAlr.idSistema);
        }
        return false;
    }

    @Override
    public int hashCode() {
        return Objects.hash(nome, idSistema);
    }
}
