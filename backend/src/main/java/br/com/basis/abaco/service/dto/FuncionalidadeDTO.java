package br.com.basis.abaco.service.dto;

/**
 * @author alexandre.costa
 * @since 27/02/2019
 */
public class FuncionalidadeDTO {

    private Long id;

    private String nome;

    private ModuloDTO modulo;


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

    public ModuloDTO getModulo() {
        return modulo;
    }

    public void setModulo(ModuloDTO modulo) {
        this.modulo = modulo;
    }
}
