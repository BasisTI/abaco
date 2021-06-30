package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.Alr;
import br.com.basis.abaco.domain.FatorAjuste;
import br.com.basis.abaco.domain.Funcionalidade;
import br.com.basis.abaco.domain.UploadedFile;
import br.com.basis.abaco.domain.enumeration.Complexidade;
import br.com.basis.abaco.domain.enumeration.StatusFuncao;
import br.com.basis.abaco.domain.enumeration.TipoFuncaoDados;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
@Getter
@Setter
public class FuncaoDadosEditSaveDTO {
    private Long id;
    private Complexidade complexidade;
    private BigDecimal pf;
    private BigDecimal grossPF;
    private Funcionalidade funcionalidade;
    private String detStr;
    private FatorAjuste fatorAjuste;
    private String name;
    private String sustantation;
    private Set<String> derValues = new HashSet<>();
    private StatusFuncao statusFuncao;
    private TipoFuncaoDados tipo;
    private String retStr;
    private Integer quantidade;
    private Alr alr;
    private List<UploadedFile> files = new ArrayList<>();
    private Set<String> rlrValues = new HashSet<>();
    private Long ordem;
}
