package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.Compartilhada;
import br.com.basis.abaco.domain.Contrato;
import br.com.basis.abaco.domain.EsforcoFase;
import br.com.basis.abaco.domain.FatorAjuste;
import br.com.basis.abaco.domain.Manual;
import br.com.basis.abaco.domain.enumeration.MetodoContagem;
import br.com.basis.abaco.domain.enumeration.TipoAnalise;
import br.com.basis.dynamicexports.pojo.ReportObject;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
public class AnaliseEditDTO implements ReportObject {

    private Long id;
    private String numeroOs;
    private String identificadorAnalise;
    private OrganizacaoAnaliseDTO organizacao;
    private TipoEquipeAnaliseDTO equipeResponsavel;
    private SistemaAnaliseDTO sistema;
    private MetodoContagem metodoContagem;
    private String pfTotal;
    private String adjustPFTotal;
    private Timestamp dataCriacaoOrdemServico ;
    private TipoAnalise tipoAnalise;
    private boolean bloqueiaAnalise;
    private boolean clonadaParaEquipe;
    private Set<UserAnaliseDTO> users = new HashSet<>();
    private String escopo;
    private String fronteiras;
    private String documentacao;
    private String propositoContagem;
    private String observacoes;
    private Boolean baselineImediatamente;
    private Timestamp dataHomologacao;
    private boolean enviarBaseline;
    private Contrato contrato;
    private FatorAjuste fatorAjuste;
    private Set<EsforcoFase> esforcoFases;
    private Manual manual;
    private Set<Compartilhada> compartilhadas;

    public void setDataCriacaoOrdemServico(Timestamp dataCriacaoOrdemServico) {
        this.dataCriacaoOrdemServico = dataCriacaoOrdemServico == null ? null : new Timestamp(dataCriacaoOrdemServico.getTime());
    }

    public Timestamp getDataCriacaoOrdemServico() {
        return dataCriacaoOrdemServico == null ? null : new Timestamp(this.dataCriacaoOrdemServico.getTime());
    }

}
