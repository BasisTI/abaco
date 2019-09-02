package br.com.basis.abaco.service.dto.filter;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FaseFiltroDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;

    private String nome;
}
