package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.Alr;
import br.com.basis.abaco.domain.Der;
import br.com.basis.abaco.domain.enumeration.Complexidade;
import br.com.basis.abaco.domain.enumeration.ImpactoFatorAjuste;
import br.com.basis.abaco.domain.enumeration.TipoFuncaoTransacao;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
public class FuncaoTransacaoAnaliseDTO {

    private Long id;
    private String name;
    private FuncionalidadeDTO funcionalidade;
    private FatorAjusteDTO fatorAjuste;
    private ImpactoFatorAjuste impacto;
    private TipoFuncaoTransacao tipo;
    private Complexidade complexidade;
    private Set<Der> ders = new HashSet<>();
    private Set<String> ftrValues = new HashSet<>();
    private String ftrStr;
    private BigDecimal pf;
    private BigDecimal grossPF;
    private String sustantation;
    private String detStr;
    private Set<String> derValues = new HashSet<>();
    private Integer quantidade;
    private Set<Alr> alrs = new HashSet<>();

}
