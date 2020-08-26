package br.com.basis.abaco.domain;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Immutable;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.io.Serializable;


@Entity
@Table(name = "vw_funcao_transacao")
@Document(indexName = "vw_funcao_transacao")
@Immutable
@Getter
@Setter
public class VwFuncaoTransacao extends VwFuncao implements Serializable {

    @Column(name = "total_alrs")
    private Integer totalAlrs;


}
