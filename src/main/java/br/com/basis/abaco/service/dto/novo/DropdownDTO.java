package br.com.basis.abaco.service.dto.novo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DropdownDTO {
    
    private Long value;
    
    private String label;
}
