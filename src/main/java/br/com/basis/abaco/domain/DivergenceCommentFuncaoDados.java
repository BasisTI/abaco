package br.com.basis.abaco.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "divergence_comments_funcao_dados")
@Document(indexName = "divergence_comments_funcao_dados")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DivergenceCommentFuncaoDados extends DivergenceComment {

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "funcao_dados_id")
    private FuncaoDados funcaoDados;

}
