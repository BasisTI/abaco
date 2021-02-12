package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.enumeration.Complexidade;
import br.com.basis.abaco.domain.enumeration.TipoFuncaoDados;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class FuncaoDadoAnaliseDTO {

    private Long id;
    private String name;
    private String fatorAjusteFilter;
    private FuncionalidadeDTO funcionalidade;
    private TipoFuncaoDados tipo;
    private Integer derFilter;
    private Integer rlrFilter;
    private Complexidade complexidade;
    private BigDecimal pf;
    private BigDecimal grossPF;
    private Boolean hasSustantation;

}
