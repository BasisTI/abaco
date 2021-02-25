package br.com.basis.abaco.service.dto.filter;

import java.util.List;

import br.com.basis.abaco.domain.enumeration.MetodoContagem;
import br.com.basis.abaco.service.dto.OrganizacaoDTO;
import br.com.basis.abaco.service.dto.SistemaDTO;
import br.com.basis.abaco.service.dto.StatusDTO;
import br.com.basis.abaco.service.dto.TipoEquipeDTO;
import br.com.basis.abaco.service.dto.UserDTO;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnaliseFilterDTO {
    private OrganizacaoDTO organizacao;
    private String identificadorAnalise;
    private TipoEquipeDTO equipe;
    private SistemaDTO sistema;
    private MetodoContagem metodoContagem;
    private UserDTO usuario;
    private StatusDTO status;
    private List<String> columnsVisible;
}
