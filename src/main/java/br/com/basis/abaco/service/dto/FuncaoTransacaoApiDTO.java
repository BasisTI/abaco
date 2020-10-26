package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.enumeration.Complexidade;
import br.com.basis.abaco.domain.enumeration.ImpactoFatorAjuste;
import br.com.basis.abaco.domain.enumeration.StatusFuncao;
import br.com.basis.abaco.domain.enumeration.TipoFuncaoTransacao;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Complexidade getComplexidade() {
        return complexidade;
    }

    public void setComplexidade(Complexidade complexidade) {
        this.complexidade = complexidade;
    }

    public BigDecimal getPf() {
        return pf;
    }

    public void setPf(BigDecimal pf) {
        this.pf = pf;
    }

    public BigDecimal getGrossPF() {
        return grossPF;
    }

    public void setGrossPF(BigDecimal grossPF) {
        this.grossPF = grossPF;
    }

    public FuncionalidadeDTO getFuncionalidade() {
        return funcionalidade;
    }

    public void setFuncionalidade(FuncionalidadeDTO funcionalidade) {
        this.funcionalidade = funcionalidade;
    }

    public String getDetStr() {
        return detStr;
    }

    public void setDetStr(String detStr) {
        this.detStr = detStr;
    }

    public FatorAjusteDTO getFatorAjuste() {
        return fatorAjuste;
    }

    public void setFatorAjuste(FatorAjusteDTO fatorAjuste) {
        this.fatorAjuste = fatorAjuste;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSustantation() {
        return sustantation;
    }

    public void setSustantation(String sustantation) {
        this.sustantation = sustantation;
    }

    public TipoFuncaoTransacao getTipo() {
        return tipo;
    }

    public void setTipo(TipoFuncaoTransacao tipo) {
        this.tipo = tipo;
    }

    public String getFtrStr() {
        return ftrStr;
    }

    public void setFtrStr(String ftrStr) {
        this.ftrStr = ftrStr;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public Set<AlrDTO> getAlrs() {
        return new LinkedHashSet<AlrDTO>(alrs);
    }

    public void setAlrs(Set<AlrDTO> alrs) {
        this.alrs = new LinkedHashSet<AlrDTO>(alrs);
    }

    public ImpactoFatorAjuste getImpacto() {
        return impacto;
    }

    public void setImpacto(ImpactoFatorAjuste impacto) {
        this.impacto = impacto;
    }

    public Set<DerFtDTO> getDers() {
        return new LinkedHashSet<DerFtDTO>(ders);

    }

    public void setDers(Set<DerFtDTO> ders) {
        this.ders = new LinkedHashSet<DerFtDTO>(ders);
    }

    public StatusFuncao getStatusFuncao() {
        return statusFuncao;
    }

    public void setStatusFuncao(StatusFuncao statusFuncao) {
        this.statusFuncao = statusFuncao;
    }

    public List<DivergenceCommentDTO> getLstDivergenceComments() {
        return  Collections.unmodifiableList(lstDivergenceComments);
    }

    public void setLstDivergenceComments(List<DivergenceCommentDTO> lstDivergenceComments) {
        this.lstDivergenceComments =  Optional.ofNullable(lstDivergenceComments)
            .map(ArrayList::new)
            .orElse(new ArrayList<>());;
    }
}
