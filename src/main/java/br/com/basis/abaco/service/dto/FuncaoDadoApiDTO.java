package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.Alr;
import br.com.basis.abaco.domain.enumeration.Complexidade;
import br.com.basis.abaco.domain.enumeration.ImpactoFatorAjuste;
import br.com.basis.abaco.domain.enumeration.TipoFuncaoDados;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
/**
 * @author alexandre.costa
 * @since 27/02/2019
 */
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

    public Set<DerFdDTO> getDers() {
        Set<DerFdDTO> ders = this.ders;
        return ders;
    }

    public void setDers(Set<DerFdDTO> ders) {
        Set<DerFdDTO> derss = ders;
        this.ders = derss;
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

    public TipoFuncaoDados getTipo() {
        return tipo;
    }

    public void setTipo(TipoFuncaoDados tipo) {
        this.tipo = tipo;
    }

    public String getRetStr() {
        return retStr;
    }

    public void setRetStr(String retStr) {
        this.retStr = retStr;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public Set<RlrFdDTO> getRlrs() {
        Set<RlrFdDTO> rlrs = this.rlrs;
        return rlrs;
    }

    public void setRlrs(Set<RlrFdDTO> rlrs) {
        Set<RlrFdDTO> rlrss = rlrs;
        this.rlrs = rlrss;
    }

    public Alr getAlr() {
        return alr;
    }

    public void setAlr(Alr alr) {
        this.alr = alr;
    }

    public ImpactoFatorAjuste getImpacto() {
        return impacto;
    }

    public void setImpacto(ImpactoFatorAjuste impacto) {
        this.impacto = impacto;
    }
}
