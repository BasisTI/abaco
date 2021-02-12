package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.enumeration.TipoSistema;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Id;

@Getter
@Setter
public class SistemaListDTO {


    @Id
    private Long id;
    private String sigla;
    private String nome;
    private TipoSistema tipoSistema;
    private String numeroOcorrencia;
    private String nomeSearch;
    private String numeroOcorrenciaSearch;
    private String siglaSearch;
    private OrganizacaoDTO organizacao;

    public String getNomeSearch() {
        return this.nome != null ? this.nome.toLowerCase() : null;
    }

    public String getNumeroOcorrenciaSearch() {
        return this.numeroOcorrencia != null ? this.numeroOcorrencia.toLowerCase() : null;
    }

    public String getSiglaSearch() {
        return this.sigla != null ? this.sigla.toLowerCase() : null;
    }
}
