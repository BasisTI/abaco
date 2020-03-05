package br.com.basis.abaco.service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Id;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SistemaAnaliseDTO {

    @Id
    private Long id;

    private String nome;

    private String sigla;

}
