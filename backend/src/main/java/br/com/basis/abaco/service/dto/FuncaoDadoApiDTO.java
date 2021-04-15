package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.Alr;
import br.com.basis.abaco.domain.UploadedFile;
import br.com.basis.abaco.domain.enumeration.Complexidade;
import br.com.basis.abaco.domain.enumeration.ImpactoFatorAjuste;
import br.com.basis.abaco.domain.enumeration.StatusFuncao;
import br.com.basis.abaco.domain.enumeration.TipoFuncaoDados;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
/**
 * @author alexandre.costa
 * @since 27/02/2019
 */
@Getter
@Setter
@NoArgsConstructor
public class FuncaoDadoApiDTO {

    private Long id;
    private Complexidade complexidade;
    private BigDecimal pf;
    private BigDecimal grossPF;
    private FuncionalidadeDTO funcionalidade;
    private Set<DerFdDTO> ders = new HashSet<>();
    private String detStr;
    private FatorAjusteDTO fatorAjuste;
    private String name;
    private String sustantation;
    private TipoFuncaoDados tipo;
    private String retStr;
    private Integer quantidade;
    private Set<RlrFdDTO> rlrs = new HashSet<>();
    private Alr alr;
    private ImpactoFatorAjuste impacto;
    private StatusFuncao statusFuncao;
    private List<DivergenceCommentDTO> lstDivergenceComments = new ArrayList<>();
    private List<UploadedFile> files;


    public List<DivergenceCommentDTO> getLstDivergenceComments() {
        return  Collections.unmodifiableList(lstDivergenceComments);
    }

    public void setLstDivergenceComments(List<DivergenceCommentDTO> lstDivergenceComments) {
        this.lstDivergenceComments =  Optional.ofNullable(lstDivergenceComments)
            .map(ArrayList::new)
            .orElse(new ArrayList<>());;
    }
}
