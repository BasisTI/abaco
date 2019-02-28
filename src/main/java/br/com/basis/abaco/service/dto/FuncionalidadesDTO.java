package br.com.basis.abaco.service.dto;

import java.util.HashSet;
import java.util.Set;
/**
 * @author alexandre.costa
 * @since 27/02/2019
 */
public class FuncionalidadesDTO {

    private Long id;

    private String nome;

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
}
