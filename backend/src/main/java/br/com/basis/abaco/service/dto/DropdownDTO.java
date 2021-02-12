package br.com.basis.abaco.service.dto;

public class DropdownDTO {

    private Long id;

    private String nome;

    public DropdownDTO(Long id, String nome) {
        this.id = id;
        this.nome = nome;
    }

    public DropdownDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

}
