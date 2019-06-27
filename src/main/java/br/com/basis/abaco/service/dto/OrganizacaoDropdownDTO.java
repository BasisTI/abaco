package br.com.basis.abaco.service.dto;

public class OrganizacaoDropdownDTO extends DropdownDTO {

    private String cnpj;

    public OrganizacaoDropdownDTO(Long id, String nome, String cnpj) {
        super(id, nome);
        this.cnpj = cnpj;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }
}
