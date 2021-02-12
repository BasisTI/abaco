package br.com.basis.abaco.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table(name = "vw_analise_soma_pf")
@Getter
@Setter
public class VwAnaliseSomaPf  implements Serializable {

    @Id
    private Long analiseId;

    @Column(name = "pf_gross")
    private BigDecimal pfGross;

    @Column(name = "pf_total")
    private BigDecimal pfTotal;

}
