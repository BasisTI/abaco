package br.com.basis.abaco.service.dto;

public class ListaFdFtDTO {

    private String nome;

    private String funcionalidade;

    private String modulo;

    private String der;

    private String alrtr;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDer() {
        return der;
    }

    public void setDer(String der) {
        this.der = der;
    }

    public String getAlrtr() {
        return alrtr;
    }

    public void setAlrtr(String alrtr) {
        this.alrtr = alrtr;
    }

    public String getFuncionalidade() {
        return funcionalidade;
    }

    public void setFuncionalidade(String funcionalidade) {
        this.funcionalidade = funcionalidade;
    }

    public String getModulo() {
        return modulo;
    }

    public void setModulo(String modulo) {
        this.modulo = modulo;
    }
}
