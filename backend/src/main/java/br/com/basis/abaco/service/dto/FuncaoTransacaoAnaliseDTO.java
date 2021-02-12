package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.enumeration.Complexidade;
import br.com.basis.abaco.domain.enumeration.ImpactoFatorAjuste;
import br.com.basis.abaco.domain.enumeration.TipoFuncaoTransacao;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class FuncaoTransacaoAnaliseDTO {

    private Long id;
    private FuncionalidadeDTO funcionalidade;
    private String name;
    private FatorAjusteDTO fatorAjuste;
    private TipoFuncaoTransacao tipo;
    private Integer derFilter;
    private Integer ftrFilter;
    private Complexidade complexidade;
    private ImpactoFatorAjuste impacto;
    private String ftrStr;
    private BigDecimal pf;
    private BigDecimal grossPF;
    private Boolean hasSustantation;

}
