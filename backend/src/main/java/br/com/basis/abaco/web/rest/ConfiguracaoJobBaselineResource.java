package br.com.basis.abaco.web.rest;

import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.modelmapper.ModelMapper;
import org.springframework.security.access.annotation.Secured;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;

import br.com.basis.abaco.domain.ConfiguracaoJobBaseline;
import br.com.basis.abaco.domain.Sistema;
import br.com.basis.abaco.domain.TipoEquipe;
import br.com.basis.abaco.service.ConfiguracaoJobBaselineService;
import br.com.basis.abaco.service.SistemaService;
import br.com.basis.abaco.service.TipoEquipeService;
import br.com.basis.abaco.service.dto.ConfiguracaoJobBaselineDTO;
import br.com.basis.abaco.service.dto.SistemaDTO;
import br.com.basis.abaco.service.dto.TipoEquipeDTO;

@RestController
@RequestMapping("/api")
public class ConfiguracaoJobBaselineResource {

    private final ConfiguracaoJobBaselineService configuracaoJobBaselineService;
    private final SistemaService sistemaService;
    private final TipoEquipeService tipoEquipeService;

    public ConfiguracaoJobBaselineResource(ConfiguracaoJobBaselineService configuracaoJobBaselineService,
            SistemaService sistemaService, TipoEquipeService tipoEquipeService) {
        this.configuracaoJobBaselineService = configuracaoJobBaselineService;
        this.sistemaService = sistemaService;
        this.tipoEquipeService = tipoEquipeService;
    }

    @PostMapping("/configuracao-baseline")
    @Timed
    @Secured("ROLE_ABACO_BASELINE_ACESSAR")
    public ConfiguracaoJobBaselineDTO createConfiguracoes(
            @Valid @RequestBody ConfiguracaoJobBaselineDTO configuracao) throws URISyntaxException {
        ConfiguracaoJobBaselineDTO configuracaoDTO = new ConfiguracaoJobBaselineDTO();

        List<ConfiguracaoJobBaseline> configuracoes = configuracaoJobBaselineService.incluirConfiguracao(configuracao);

        return getConfiguracaoSistemaEquipeDTO(configuracaoDTO, configuracoes);
    }

    @GetMapping("/configuracao-baseline")
    @Timed
    @Secured("ROLE_ABACO_BASELINE_ACESSAR")
    public ConfiguracaoJobBaselineDTO getAll() throws URISyntaxException {
        ConfiguracaoJobBaselineDTO configuracaoDTO = new ConfiguracaoJobBaselineDTO();
        List<ConfiguracaoJobBaseline> configuracoes = configuracaoJobBaselineService.consultarTodos();

        return getConfiguracaoSistemaEquipeDTO(configuracaoDTO, configuracoes);

    }
    private ConfiguracaoJobBaselineDTO getConfiguracaoSistemaEquipeDTO(ConfiguracaoJobBaselineDTO configuracaoDTO,
            List<ConfiguracaoJobBaseline> configuracoes) {
        List<Sistema> sistemas = sistemaService.getAll();
        List<TipoEquipe> equipes = tipoEquipeService.getAll();
        List<Sistema> sistemasIncluidos = configuracoes.stream().map(config -> config.getSistema()).distinct().collect(Collectors.toList());
        List<TipoEquipe> tipoEquipeIncluida = configuracoes.stream().map(config -> config.getTipoEquipe()).distinct().collect(Collectors.toList());

        sistemas.removeAll(sistemasIncluidos);
        configuracaoDTO.setSistemasDisponiveis(sistemas.stream().map(sis -> new ModelMapper().map(sis, SistemaDTO.class)).collect(Collectors.toList()));
        configuracaoDTO.setSistemasSelecionados(sistemasIncluidos.stream().distinct().map(sis -> new ModelMapper().map(sis, SistemaDTO.class)).collect(Collectors.toList()));

        List<TipoEquipe> equipesDisponiveis = equipes.stream().filter(eq -> tipoEquipeIncluida.indexOf(eq) == -1).collect(Collectors.toList());
        configuracaoDTO.setEquipesDisponiveis(equipesDisponiveis.stream().map(eq -> new ModelMapper().map(eq, TipoEquipeDTO.class)).collect(Collectors.toList()));
        configuracaoDTO.setEquipesSelecionados(tipoEquipeIncluida.stream().distinct().map(eq -> new ModelMapper().map(eq, TipoEquipeDTO.class)).collect(Collectors.toList()));

        return configuracaoDTO;
    }

}
