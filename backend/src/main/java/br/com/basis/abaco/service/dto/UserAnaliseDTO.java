package br.com.basis.abaco.service.dto;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class UserAnaliseDTO implements Serializable {

    private Long id;

    private String firstName;

    private String lastName;

}
