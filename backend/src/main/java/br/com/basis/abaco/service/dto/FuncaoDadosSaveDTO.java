package br.com.basis.abaco.service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.TreeSet;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FuncaoDadosSaveDTO extends FuncaoDadosEditSaveDTO {

    private TreeSet<RlrDTO> rlrs = new TreeSet<>();
    private TreeSet<DerDTO> ders = new TreeSet<>();



}
