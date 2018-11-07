package br.com.basis.abaco.domain;

import javax.persistence.Column;
import javax.persistence.Table;

/**
 * Objeto da baseline.
 *
 * @Entity
 * @Table(name = "baseline")
 * @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
 * @Document(indexName = "baseline")
 */
@Table(name = "BSLTB_BASELINE")
public class Baseline {

    @Column(name = "BSL_CD")
    private Long id;

    private Analise analise;

    private FuncaoDados funcaoDados;

    private FuncaoTransacao funcaoTransacao;

}
