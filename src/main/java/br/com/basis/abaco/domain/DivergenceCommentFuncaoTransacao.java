package br.com.basis.abaco.domain;

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
@Table(name = "divergence_comments_funcao_transacao")
@Document(indexName = "divergence_comments_funcao_transacao")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DivergenceCommentFuncaoTransacao extends DivergenceComment {

    @ManyToOne
    @JoinColumn(name = "funcao_transacao_id")
    private FuncaoTransacao funcaoTransacao;

}
