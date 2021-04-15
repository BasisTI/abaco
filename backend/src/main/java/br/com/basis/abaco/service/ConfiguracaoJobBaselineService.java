package br.com.basis.abaco.service;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.basis.abaco.domain.ConfiguracaoJobBaseline;
import br.com.basis.abaco.domain.Sistema;
import br.com.basis.abaco.domain.TipoEquipe;
import br.com.basis.abaco.repository.ConfiguracaoJobBaselineRepository;
import br.com.basis.abaco.service.dto.ConfiguracaoJobBaselineDTO;
import br.com.basis.abaco.service.dto.SistemaDTO;
import br.com.basis.abaco.service.dto.TipoEquipeDTO;

@Service
public class ConfiguracaoJobBaselineService extends BaseService {

    private final ConfiguracaoJobBaselineRepository configuracaoJobBaselineRepository;
    @Autowired
    private ModelMapper modelMapper;

    public ConfiguracaoJobBaselineService(ConfiguracaoJobBaselineRepository configuracaoJobBaselineRepository) {
        this.configuracaoJobBaselineRepository = configuracaoJobBaselineRepository;
    }

    @Transactional
    public List<ConfiguracaoJobBaseline> incluirConfiguracao(ConfiguracaoJobBaselineDTO configuracao) {
        configuracaoJobBaselineRepository.deleteAll();
        List<ConfiguracaoJobBaseline> configuracoesIncluir = new ArrayList<>();
        if (configuracao.getSistemasSelecionados() != null && !configuracao.getSistemasSelecionados().isEmpty()) {
            preencherListaIncluir(configuracao, configuracoesIncluir);
        } else if (configuracao.getEquipesSelecionados() != null && !configuracao.getEquipesSelecionados().isEmpty()) {
            for (TipoEquipeDTO tipoEquipe : configuracao.getEquipesSelecionados()) {
                ConfiguracaoJobBaseline config = new ConfiguracaoJobBaseline();
                config.setTipoEquipe(modelMapper.map(tipoEquipe, TipoEquipe.class));
                configuracoesIncluir.add(config);
            }
        }

        return configuracaoJobBaselineRepository.save(configuracoesIncluir);
    }

    private void preencherListaIncluir(ConfiguracaoJobBaselineDTO configuracao,
            List<ConfiguracaoJobBaseline> configuracoesIncluir) {
        for (SistemaDTO sistema : configuracao.getSistemasSelecionados()) {
            if (configuracao.getEquipesSelecionados() == null || configuracao.getEquipesSelecionados().isEmpty()) {
                ConfiguracaoJobBaseline config = new ConfiguracaoJobBaseline();
                config.setSistema(modelMapper.map(sistema, Sistema.class));
                configuracoesIncluir.add(config);
            } else {
                for (TipoEquipeDTO tipoEquipe : configuracao.getEquipesSelecionados()) {
                    ConfiguracaoJobBaseline config = new ConfiguracaoJobBaseline();
                    config.setSistema(modelMapper.map(sistema, Sistema.class));
                    config.setTipoEquipe(modelMapper.map(tipoEquipe, TipoEquipe.class));
                    configuracoesIncluir.add(config);
                }
            }
        }
    }

    public List<ConfiguracaoJobBaseline> consultarTodos() {
        return configuracaoJobBaselineRepository.findAll();
    }
}
