package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.Alr;
import br.com.basis.abaco.domain.Der;
import br.com.basis.abaco.domain.FuncaoDadosVersionavel;
import br.com.basis.abaco.domain.Rlr;
import br.com.basis.abaco.domain.UploadedFile;
import br.com.basis.abaco.domain.enumeration.Complexidade;
import br.com.basis.abaco.domain.enumeration.ImpactoFatorAjuste;
import br.com.basis.abaco.domain.enumeration.TipoFuncaoDados;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
public class FuncaoDadoAnaliseDTO {

    private Long id;
    private String name;
    private TipoFuncaoDados tipo;
    private String retStr;
    private Integer quantidade;
    private Set<Rlr> rlrs = new HashSet<>();
    private Alr alr;
    private Set<Der> ders = new LinkedHashSet<>();
    private List<UploadedFile> files = new ArrayList<>();
    private Set<String> rlrValues = new HashSet<>();
    private FuncaoDadosVersionavel funcaoDadosVersionavel;
    private ImpactoFatorAjuste impacto;
    private Complexidade complexidade;
    private BigDecimal pf;
    private BigDecimal grossPF;
    private FuncionalidadeDTO funcionalidade;
    private String detStr;
    private FatorAjusteDTO fatorAjuste;
    private String sustantation;
    private Set<String> derValues = new HashSet<>();

}
