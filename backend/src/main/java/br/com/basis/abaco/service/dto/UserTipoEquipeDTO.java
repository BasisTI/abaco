package br.com.basis.abaco.service.dto;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Id;

@Getter
@Setter
public class UserTipoEquipeDTO {

    @Id
    private Long id;

    private String firstName;

    private String lastName;


}
