package br.com.basis.abaco.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
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
@AllArgsConstructor
@NoArgsConstructor
public class VwAnaliseSomaPf implements Serializable {

    @Id
    private Long analiseId;
    @Column
    private BigDecimal pfGross;
    @Column
    private BigDecimal pfTotal;
}
