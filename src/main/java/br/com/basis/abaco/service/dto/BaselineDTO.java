package br.com.basis.abaco.service.dto;

public class BaselineDTO {

    private String nome;

    private String classificacao;

    private String rlr;

    private String der;

    private String complexidade;

    private String pf;

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

    public String getRlr() {
        return rlr;
    }

    public void setRlr(String rlr) {
        this.rlr = rlr;
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

    public String getPf() {
        return pf;
    }

    public void setPf(String pf) {
        this.pf = pf;
    }

}
