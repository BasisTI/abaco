package br.com.basis.abaco.service;

import br.com.basis.abaco.service.dto.DropdownDTO;

public class UserDropdownDTO extends DropdownDTO {
    private DropdownDTO user;

    public UserDropdownDTO(Long id, String nome, Long idUser) {
        super(id, nome);
        this.user = new DropdownDTO(idUser, null);
    }

    public UserDropdownDTO() {
    }

    public DropdownDTO getUser() {
        return user;
    }

    public void setOUser(DropdownDTO organizacao) {
        this.user = user;
    }
}
