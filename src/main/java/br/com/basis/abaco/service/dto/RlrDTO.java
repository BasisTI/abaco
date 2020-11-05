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

}
