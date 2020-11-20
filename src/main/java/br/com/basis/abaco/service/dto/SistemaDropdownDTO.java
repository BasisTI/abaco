package br.com.basis.abaco.service.dto;

public class SistemaDropdownDTO extends DropdownDTO {

    private DropdownDTO organizacao;

    public SistemaDropdownDTO(Long id, String nome, Long idOrganizacao, String sigla) {
        super(id, nome + " - " + sigla);
        this.organizacao = new DropdownDTO(idOrganizacao, null);
    }

    public SistemaDropdownDTO() {
    }

    public DropdownDTO getOrganizacao() {
        return organizacao;
    }

    public void setOrganizacao(DropdownDTO organizacao) {
        this.organizacao = organizacao;
    }
}
