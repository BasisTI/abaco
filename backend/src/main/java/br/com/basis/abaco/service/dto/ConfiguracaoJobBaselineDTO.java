package br.com.basis.abaco.service.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

public class ConfiguracaoJobBaselineDTO {

    private @Getter @Setter List<SistemaDTO> sistemasDisponiveis;
    private @Getter @Setter List<SistemaDTO> sistemasSelecionados;
    private @Getter @Setter List<TipoEquipeDTO> equipesDisponiveis;
    private @Getter @Setter List<TipoEquipeDTO> equipesSelecionados;
    public ConfiguracaoJobBaselineDTO() {
        sistemasDisponiveis = new ArrayList<>();
        sistemasSelecionados = new ArrayList<>();
        equipesDisponiveis = new ArrayList<>();
        equipesSelecionados = new ArrayList<>();
        
    }
    
    
    
}
