package br.com.basis.abaco.service.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RlrDTO {

    private Long id;

    private String nome;

    private Integer valor;

    private FuncaoDadosSaveDTO funcaoDados;

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
}
