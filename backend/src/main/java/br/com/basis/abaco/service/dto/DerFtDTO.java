package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.Rlr;
import lombok.Getter;
import lombok.Setter;

/**
 * @author eduardo.andrade
 * @since 29/06/2018
 */
@Getter
@Setter
public class DerFtDTO {

    private Long id;

    private String nome;

    private Integer valor;

    private Rlr rlr;
}
