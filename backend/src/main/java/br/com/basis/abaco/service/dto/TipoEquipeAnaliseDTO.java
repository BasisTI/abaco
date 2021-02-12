package br.com.basis.abaco.service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Id;
import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TipoEquipeAnaliseDTO implements Serializable {
    @Id
    private Long id;

    private String nome;
}
