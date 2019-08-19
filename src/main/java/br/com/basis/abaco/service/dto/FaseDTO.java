package br.com.basis.abaco.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FaseDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;

    private String nome;

}
