package br.com.basis.abaco.service.dto.filter;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchFilterDTO {
    private String nome;
    private List<String> columnsVisible; 
}
