package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.Der;
import br.com.basis.abaco.domain.Rlr;
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
public class FuncaoDadosEditDTO extends FuncaoDadosEditSaveDTO{

    private Set<Rlr> rlrs = new HashSet<>();
    private Set<Der> ders = new LinkedHashSet<>();



}
