package br.com.basis.abaco.schedule;

import java.util.ArrayList;
import java.util.List;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import br.com.basis.abaco.domain.BaseLineSintetico;
import br.com.basis.abaco.domain.ConfiguracaoJobBaseline;
import br.com.basis.abaco.domain.Sistema;
import br.com.basis.abaco.domain.TipoEquipe;
import br.com.basis.abaco.repository.SistemaRepository;
import br.com.basis.abaco.repository.TipoEquipeRepository;
import br.com.basis.abaco.service.BaselineSinteticoService;
import br.com.basis.abaco.service.ConfiguracaoJobBaselineService;

@Component
@EnableScheduling
public class BaselineSchedule {

    private static final String TIME_ZONE = "America/Sao_Paulo";

    private final SistemaRepository sistemaRepository;
    private final TipoEquipeRepository tipoEquipeRepository;
    private final BaselineSinteticoService baselineSinteticoService;
    private final ConfiguracaoJobBaselineService configuracaoJobBaselineService;

    public BaselineSchedule(SistemaRepository sistemaRepository, TipoEquipeRepository tipoEquipeRepository,
            BaselineSinteticoService baselineSinteticoService,
            ConfiguracaoJobBaselineService configuracaoJobBaselineService) {
        this.sistemaRepository = sistemaRepository;
        this.tipoEquipeRepository = tipoEquipeRepository;
        this.baselineSinteticoService = baselineSinteticoService;
        this.configuracaoJobBaselineService = configuracaoJobBaselineService;
    }

    @Scheduled(cron = "0 0 22 * * *", zone = TIME_ZONE)
    public void verificaPorHora() {
        List<ConfiguracaoJobBaseline> configuracoes = this.configuracaoJobBaselineService.consultarTodos();
        List<Sistema> sistemas = new ArrayList<>();
        List<TipoEquipe> tipoEquipes = new ArrayList<>();
        if (configuracoes != null && !configuracoes.isEmpty()) {
            atualizaBaseLineConfiguracaoInformada(configuracoes, sistemas, tipoEquipes);
        } else {
            sistemas = sistemaRepository.findAll();
            tipoEquipes = tipoEquipeRepository.findAll();
            atualizaBaseLineSemSistemaEquipe(sistemas, tipoEquipes);
        }
    }

    private void atualizaBaseLineConfiguracaoInformada(List<ConfiguracaoJobBaseline> configuracoes,
            List<Sistema> sistemas, List<TipoEquipe> tipoEquipes) {
        if (configuracoes.get(0).getSistema() == null) {
            sistemas = sistemaRepository.findAll();
        }
        if (configuracoes.get(0).getTipoEquipe() == null) {
            tipoEquipes = tipoEquipeRepository.findAll();
        }
        for (ConfiguracaoJobBaseline configuracaoJobBaseline : configuracoes) {
            if (configuracaoJobBaseline.getSistema() == null) {
                atualizaBaselineSomenteEquipe(sistemas, configuracaoJobBaseline);
            } else if (configuracaoJobBaseline.getTipoEquipe() == null) {
                atualizaBaseLineSomenteSistema(tipoEquipes, configuracaoJobBaseline);
            } else {
                atualizaBaseLineSistemaEquipe(configuracaoJobBaseline);
            }
        }
    }

    private void atualizaBaseLineSemSistemaEquipe(List<Sistema> sistemas, List<TipoEquipe> tipoEquipes) {
        for (Sistema sistema : sistemas) {
            for (TipoEquipe tipoEquipe : tipoEquipes) {
                BaseLineSintetico baseLineSintetico = baselineSinteticoService.getBaseLineSintetico(sistema.getId(),
                        tipoEquipe.getId());
                if (baseLineSintetico != null) {
                    baseLineSintetico = baselineSinteticoService.getBaseLineAnaliticoFDFT(sistema.getId(),
                            tipoEquipe.getId(), baseLineSintetico);
                }
            }
        }
    }

    private void atualizaBaseLineSistemaEquipe(ConfiguracaoJobBaseline configuracaoJobBaseline) {
        BaseLineSintetico baseLineSintetico = baselineSinteticoService.getBaseLineSintetico(
                configuracaoJobBaseline.getSistema().getId(), configuracaoJobBaseline.getTipoEquipe().getId());
        if (baseLineSintetico != null) {
            baselineSinteticoService.getBaseLineAnaliticoFDFT(configuracaoJobBaseline.getSistema().getId(),
                    configuracaoJobBaseline.getTipoEquipe().getId(), baseLineSintetico);
        }
    }

    private void atualizaBaseLineSomenteSistema(List<TipoEquipe> tipoEquipes,
            ConfiguracaoJobBaseline configuracaoJobBaseline) {
        for (TipoEquipe tipoEquipe : tipoEquipes) {
            BaseLineSintetico baseLineSintetico = baselineSinteticoService
                    .getBaseLineSintetico(configuracaoJobBaseline.getSistema().getId(), tipoEquipe.getId());
            if (baseLineSintetico != null) {
                baselineSinteticoService.getBaseLineAnaliticoFDFT(configuracaoJobBaseline.getSistema().getId(),
                        tipoEquipe.getId(), baseLineSintetico);
            }
        }
    }

    private void atualizaBaselineSomenteEquipe(List<Sistema> sistemas,
            ConfiguracaoJobBaseline configuracaoJobBaseline) {
        for (Sistema sistema : sistemas) {
            BaseLineSintetico baseLineSintetico = baselineSinteticoService.getBaseLineSintetico(sistema.getId(),
                    configuracaoJobBaseline.getTipoEquipe().getId());
            if (baseLineSintetico != null) {
                baselineSinteticoService.getBaseLineAnaliticoFDFT(sistema.getId(),
                        configuracaoJobBaseline.getTipoEquipe().getId(), baseLineSintetico);
            }
        }
    }
}
