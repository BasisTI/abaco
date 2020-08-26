package br.com.basis.abaco.service.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class FuncionalidadeAnaliseDTO {
    private Long id;

    private String nome;

    private ModuloFuncaoDTO modulo;
}
