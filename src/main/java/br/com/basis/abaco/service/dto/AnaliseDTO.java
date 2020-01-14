package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.enumeration.MetodoContagem;
import br.com.basis.dynamicexports.pojo.ReportObject;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Set;

@Getter
@Setter
public class AnaliseDTO implements Serializable, ReportObject {
    private static final long serialVersionUID = 1L;

    private Long id;
    @NotNull
    private OrganizacaoDTO organizacao;
    @NotNull
    private String identificadorAnalise;
    @NotNull
    private TipoEquipeDTO tipoEquipe;
    @NotNull
    private SistemaDTO sistema;
    @NotNull
    private MetodoContagem metodoContagem;
    @NotNull
    private String pfTotal;
    @NotNull
    private String adjustPFTotal;
    @NotNull
    private Timestamp dataCriacaoOrdemServico;
    @NotNull
    private Timestamp dataHomologacao;
    @NotNull
    private Set<UserDTO> users;

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public Timestamp getDataCriacaoOrdemServico() {
        return (Timestamp) dataCriacaoOrdemServico.clone();
    }

    public void setDataCriacaoOrdemServico(Timestamp dataCriacaoOrdemServico) {
        this.dataCriacaoOrdemServico = (Timestamp) dataCriacaoOrdemServico.clone();
    }

    public Timestamp getDataHomologacao() {
        return (Timestamp) dataHomologacao.clone();
    }

    public void setDataHomologacao(Timestamp dataHomologacao) {
        this.dataHomologacao = (Timestamp) dataHomologacao.clone();
    }
}
