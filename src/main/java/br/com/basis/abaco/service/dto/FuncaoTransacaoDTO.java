package br.com.basis.abaco.service.dto;

/**
 * @author eduardo.andrade
 * @since 28/06/2018
 *
 */
public class FuncaoTransacaoDTO {

    private String nome;
    
    private String classificacao;
    
    private String impacto;
    
    private String ftr;
    
    private String der;
    
    private String complexidade;
    
    private String pfTotal;
    
    private String pfAjustado;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getClassificacao() {
        return classificacao;
    }

    public void setClassificacao(String classificacao) {
        this.classificacao = classificacao;
    }

    public String getImpacto() {
        return impacto;
    }

    public void setImpacto(String impacto) {
        this.impacto = impacto;
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

    public String getComplexidade() {
        return complexidade;
    }

    public void setComplexidade(String complexidade) {
        this.complexidade = complexidade;
    }

    public String getPfTotal() {
        return pfTotal;
    }

    public void setPfTotal(String pfTotal) {
        this.pfTotal = pfTotal;
    }

    public String getPfAjustado() {
        return pfAjustado;
    }

    public void setPfAjustado(String pfAjustado) {
        this.pfAjustado = pfAjustado;
    }
}
