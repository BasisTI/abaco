package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.UploadedFile;
import br.com.basis.abaco.domain.enumeration.Complexidade;
import br.com.basis.abaco.domain.enumeration.ImpactoFatorAjuste;
import br.com.basis.abaco.domain.enumeration.StatusFuncao;
import br.com.basis.abaco.domain.enumeration.TipoFuncaoTransacao;
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

@Getter
@Setter
@NoArgsConstructor
public class FuncaoTransacaoApiDTO {

    private Long id;
    private Complexidade complexidade;
    private BigDecimal pf;
    private BigDecimal grossPF;
    private FuncionalidadeDTO funcionalidade;
    private String detStr;
    private FatorAjusteDTO fatorAjuste;
    private String name;
    private String sustantation;
    private TipoFuncaoTransacao tipo;
    private String ftrStr;
    private Integer quantidade;
    private Set<AlrDTO> alrs = new HashSet<>();
    private ImpactoFatorAjuste impacto;
    private Set<DerFtDTO> ders = new HashSet<>();
    private StatusFuncao statusFuncao;
    private List<DivergenceCommentDTO> lstDivergenceComments = new ArrayList<>();
    private List<UploadedFileDTO    > files;

    public List<DivergenceCommentDTO> getLstDivergenceComments() {
        return  Collections.unmodifiableList(lstDivergenceComments);
    }

    public void setLstDivergenceComments(List<DivergenceCommentDTO> lstDivergenceComments) {
        this.lstDivergenceComments =  Optional.ofNullable(lstDivergenceComments)
            .map(ArrayList::new)
            .orElse(new ArrayList<>());
    }
}
