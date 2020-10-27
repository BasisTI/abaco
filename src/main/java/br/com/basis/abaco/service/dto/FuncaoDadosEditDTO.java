package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.Alr;
import br.com.basis.abaco.domain.Der;
import br.com.basis.abaco.domain.FatorAjuste;
import br.com.basis.abaco.domain.Funcionalidade;
import br.com.basis.abaco.domain.enumeration.Complexidade;
import br.com.basis.abaco.domain.enumeration.StatusFuncao;
import br.com.basis.abaco.domain.enumeration.TipoFuncaoDados;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
public class FuncaoDadosEditDTO {

    private Long id;
    private Complexidade complexidade;
    private BigDecimal pf;
    private BigDecimal grossPF;
    private Funcionalidade funcionalidade;
    private String detStr;
    private FatorAjuste fatorAjuste;
    private String name;
    private String sustantation;
    private StatusFuncao statusFuncao;
    private TipoFuncaoDados tipo;
    private String retStr;
    private Alr alr;
    private List<DivergenceCommentDTO> lstDivergenceComments = new ArrayList<>();
    private Set<Der> ders = new LinkedHashSet<>();

    public List<DivergenceCommentDTO> getLstDivergenceComments() {
        return  Collections.unmodifiableList(lstDivergenceComments);
    }

    public void setLstDivergenceComments(List<DivergenceCommentDTO> lstDivergenceComments) {
        this.lstDivergenceComments =  Optional.ofNullable(lstDivergenceComments)
            .map(ArrayList::new)
            .orElse(new ArrayList<>());;
    }
}
