package br.com.basis.abaco.service.dto.filter;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserFilterDTO {

    private String nome;
    private String login;
    private String email;
    private Long[] organizacao;
    private String[] perfil;
    private Long[] equipe;
    private List<String> columnsVisible; 
}
