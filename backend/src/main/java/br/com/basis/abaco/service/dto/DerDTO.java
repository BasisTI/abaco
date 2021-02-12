package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.Rlr;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DerDTO {

    private Long id;

    private String nome;

    private Integer valor;

    private Rlr rlr;

    private FuncaoDadosSaveDTO funcaoDados;

}
