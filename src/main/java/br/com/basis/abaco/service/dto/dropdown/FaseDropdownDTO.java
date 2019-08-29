package br.com.basis.abaco.service.dto.dropdown;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class FaseDropdownDTO implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private Long id;
    
    private String nome;
}
