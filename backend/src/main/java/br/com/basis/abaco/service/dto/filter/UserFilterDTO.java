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
    private List<Long> organizacao;
    private List<String> perfil;
    private List<Long> equipe;
    private List<String> columnsVisible; 
}
