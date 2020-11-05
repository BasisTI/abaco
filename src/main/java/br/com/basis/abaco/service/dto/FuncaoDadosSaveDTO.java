package br.com.basis.abaco.service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FuncaoDadosSaveDTO extends FuncaoDadosEditSaveDTO {

    private Set<RlrDTO> rlrs = new HashSet<>();
    private Set<DerDTO> ders = new LinkedHashSet<>();



}
