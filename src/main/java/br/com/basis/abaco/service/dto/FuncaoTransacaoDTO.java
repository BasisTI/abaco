package br.com.basis.abaco.service.dto;

import java.math.BigDecimal;

public class FuncaoTransacaoDTO {

    private String fatorAjuste;
    
    private String impacto;
    
    private String modulo;
    
    private String funcionalidade;
    
    private String nome;
    
    private String tipo;
    
    private Integer totalDer;
    
    private Integer totalFtr;
    
    private String complexidade;
    
    private BigDecimal pfTotal;
    
    private BigDecimal pfAjustado;
    
    private String ftr;
    
    private String der;
    
    private ComplexidadeDTO complexidadeDto;
    
    private ImpactoDTO impactoDto;

    public String getFatorAjuste() {
        return fatorAjuste;
    }

    public void setFatorAjuste(String fatorAjuste) {
        this.fatorAjuste = fatorAjuste;
    }

    public String getImpacto() {
        return impacto;
    }

    public void setImpacto(String impacto) {
        this.impacto = impacto;
    }

    public String getModulo() {
        return modulo;
    }

    public void setModulo(String modulo) {
        this.modulo = modulo;
    }

    public String getFuncionalidade() {
        return funcionalidade;
    }

    public void setFuncionalidade(String funcionalidade) {
        this.funcionalidade = funcionalidade;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Integer getTotalDer() {
        return totalDer;
    }

    public void setTotalDer(Integer totalDer) {
        this.totalDer = totalDer;
    }

    public Integer getTotalFtr() {
        return totalFtr;
    }

    public void setTotalFtr(Integer totalFtr) {
        this.totalFtr = totalFtr;
    }

    public String getComplexidade() {
        return complexidade;
    }

    public void setComplexidade(String complexidade) {
        this.complexidade = complexidade;
    }

    public BigDecimal getPfTotal() {
        return pfTotal;
    }

    public void setPfTotal(BigDecimal pfTotal) {
        this.pfTotal = pfTotal;
    }

    public BigDecimal getPfAjustado() {
        return pfAjustado;
    }

    public void setPfAjustado(BigDecimal pfAjustado) {
        this.pfAjustado = pfAjustado;
    }

    public String getFtr() {
        return ftr;
    }

    public void setFtr(String ftr) {
        this.ftr = ftr;
    }

    public String getDer() {
        return der;
    }

    public void setDer(String der) {
        this.der = der;
    }

    public ComplexidadeDTO getComplexidadeDto() {
        return complexidadeDto;
    }

    public void setComplexidadeDto(ComplexidadeDTO complexidadeDto) {
        this.complexidadeDto = complexidadeDto;
    }

    public ImpactoDTO getImpactoDto() {
        return impactoDto;
    }

    public void setImpactoDto(ImpactoDTO impactoDto) {
        this.impactoDto = impactoDto;
    }
    
}
