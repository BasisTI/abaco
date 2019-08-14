package br.com.basis.abaco.service.dto.filtro;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class FaseFiltroDTO {
    private static final long serialVersionUID = 1L;

    private Long id;

    private String nome;
}
