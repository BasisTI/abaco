package br.com.basis.abaco.service.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DropdownFuncaoDadosDTO {

    private Long id;

    private String name;

    public DropdownFuncaoDadosDTO(Long id, String nome) {
        this.id = id;
        this.name = nome;
    }

}
