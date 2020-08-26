package br.com.basis.abaco.service.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @author eduardo.andrade
 * @since 28/06/2018
 */
@Getter
@Setter
@NoArgsConstructor
public class FuncaoDadosDTO {

    private String nomeFd;

    private String classificacaoFd;

    private String impactoFd;

    private String rlrFd;

    private String derFd;

    private String complexidadeFd;

    private String pfTotalFd;

    private String pfAjustadoFd;

    private String fatorAjusteFd;

    private String fatorAjusteValor;

    private String modulo;

    private String submodulo;

    private Integer identificador;

    private String sustantation;

    private String der;

    private String rlr;

}
