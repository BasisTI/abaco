package br.com.basis.abaco.service.dto;

public class OrganizacaoDropdownDTO extends DropdownDTO {

    private String cnpj;

    public OrganizacaoDropdownDTO(Long id, String nome, String sigla, String cnpj) {
        super(id, sigla + " - " + nome);
        this.cnpj = cnpj;
    }

    public OrganizacaoDropdownDTO() {
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }
}
