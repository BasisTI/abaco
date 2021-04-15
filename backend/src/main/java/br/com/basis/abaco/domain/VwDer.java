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
@Table(name = "vw_der")
@Document(indexName = "vw_der")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VwDer {

    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "nome")
    @Field(index = FieldIndex.not_analyzed, type = FieldType.String)
    private String nome;

    @Column(name = "id_sistema_fd")
    private Long idSistemaFD;


    @Column(name = "id_sistema_ft")
    private Long idSistemaFT;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        VwDer vwDer = (VwDer) o;
        if(vwDer.nome == null || nome == null) {
            return false;
        }
        if(vwDer.idSistemaFD == null && vwDer.idSistemaFT == null){
            return false;
        }
        if(idSistemaFD == null && idSistemaFT == null){
            return false;
        }
        if(Objects.equals(nome, vwDer.nome)){
            if(vwDer.idSistemaFD != null && idSistemaFD != null){
                return Objects.equals(idSistemaFD, vwDer.idSistemaFD);
            }
            if(vwDer.idSistemaFT != null && idSistemaFT != null){
                return Objects.equals(idSistemaFT, vwDer.idSistemaFT);
            }
        }
        return false;
    }

    @Override
    public int hashCode() {
        return Objects.hash(nome, idSistemaFD, idSistemaFT);
    }
}
