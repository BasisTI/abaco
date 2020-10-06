package br.com.basis.abaco.service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PEAnaliticoDTO {

    private Long idfuncaodados;
    private String classificacao;
    private String name;
    private String complexidade;
    private String nomeFuncionalidade;
    private String nomeModulo;
    private Long idFuncionalidade;
    private Long idModulo;
}
