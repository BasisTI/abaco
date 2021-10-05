
package br.com.basis.abaco.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "vw_analise_ft")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VwAnaliseFT {

    @Id
    @Column(name = "id_analise")
    private Long id;

    @Column(name = "numero_os")
    private String numeroOs;

    @Column(name = "metodo_contagem")
    private String metodoContagem;

    @Column(name = "pf_total")
    private String pfTotal;

    @Column(name = "pf_ajustado")
    private String pfAjustado;

    @Column(name = "identificador_analise")
    private String identificadorAnalise;

    @Column(name = "organizacao_nome")
    private String organizacaoNome;

    @Column(name = "equipe_nome")
    private String equipeNome;

    @Column(name = "sistema_nome")
    private String sistemaNome;

    @Column(name = "modulo_nome")
    private String moduloNome;

    @Column(name = "funcionalidade_nome")
    private String funcionalidadeNome;

    @Column(name = "funcao_nome")
    private String funcaoNome;
}
