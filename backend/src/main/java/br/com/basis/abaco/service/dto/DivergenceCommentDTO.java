package br.com.basis.abaco.service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DivergenceCommentDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String comment;
    private UserAnaliseDTO user;

}
