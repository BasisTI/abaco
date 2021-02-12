package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.Rlr;

public class DerFdDTO {

    private Long id;

    private String nome;

    private Integer valor;

    private Rlr rlr;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Integer getValor() {
        return valor;
    }

    public void setValor(Integer valor) {
        this.valor = valor;
    }

    public Rlr getRlr() {
        return rlr;
    }

    public void setRlr(Rlr rlr) {
        this.rlr = rlr;
    }
}
