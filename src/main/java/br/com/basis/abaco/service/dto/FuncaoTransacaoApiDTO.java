package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.enumeration.Complexidade;
import br.com.basis.abaco.domain.enumeration.ImpactoFatorAjuste;
import br.com.basis.abaco.domain.enumeration.TipoFuncaoTransacao;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.LinkedHashSet;
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

    private Set<AlrFtDTO> alrs = new HashSet<>();

    private ImpactoFatorAjuste impacto;

    private Set<DerFtDTO> ders = new HashSet<>();

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

    public Set<AlrFtDTO> getAlrs() {
        return new LinkedHashSet<AlrFtDTO>(alrs);
    }

    public void setAlrs(Set<AlrFtDTO> alrs) {
        this.alrs = new LinkedHashSet<AlrFtDTO>(alrs);
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
}
