package br.com.basis.abaco.reports.util;

public final class TableOfContentBean {

    private String codigo;
    private String nome;
    private String pagina;

    public TableOfContentBean(){
    }

    public TableOfContentBean(String codigo, String nome, String pagina) {
        this.codigo = codigo;
        this.nome = nome;
        this.pagina = pagina;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getPagina() {
        return pagina;
    }

    public void setPagina(String pagina) {
        this.pagina = pagina;
    }
}
