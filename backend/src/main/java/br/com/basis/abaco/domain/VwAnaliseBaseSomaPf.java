package br.com.basis.abaco.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Id;
import java.math.BigDecimal;

@Getter
@Setter
public class VwAnaliseBaseSomaPf {

    @Id
    private Long analiseId;

    @Column(name = "pf_gross")
    private BigDecimal pfGross;

    @Column(name = "pf_total")
    private BigDecimal pfTotal;
}
