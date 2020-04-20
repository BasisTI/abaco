package br.com.basis.abaco.domain;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Immutable;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;
import java.math.BigDecimal;


@Entity
@Table(name = "vw_funcao_transacao")
@Document(indexName = "vw_funcao_dado")
@Immutable
@Getter
@Setter
public class VwFuncaoTransacao implements Serializable {

    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "tipo")
    private String tipo;

    @Column(name = "complexidade")
    private String complexidade;

    @Column(name = "pf")
    private BigDecimal pf;

    @Column(name = "grosspf")
    private BigDecimal grossPF;

    @Column(name = "analise_id")
    private Long analiseId;

    @Column(name = "fator_ajuste_id")
    private String fatorAjusteId;

    @Column(name = "name")
    private String name;

    @Column(name = "sustantation")
    private String sustantation;

    @Column(name = "funcionalidade_id")
    private Long idFuncionalidade;

    @Column(name = "nome_funcionalidade")
    private String nomeFuncionalidade;

    @Column(name = "id_modulo")
    private Long idModulo;

    @Column(name = "nome_modulo")
    private String nomeModulo;

    @Column(name = "deflator")
    private String deflator;

    @Column(name = "totalDers")
    private Integer totalDers;

    @Column(name = "total_alrs")
    private Integer totalAlrs;


}
