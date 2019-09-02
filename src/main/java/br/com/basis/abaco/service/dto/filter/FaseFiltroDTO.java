package br.com.basis.abaco.service.dto.filter;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FaseFiltroDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;

    private String nome;
}
