package br.com.basis.abaco.service.dto;

import java.util.HashSet;
import java.util.Set;

/**
 * @author alexandre.costa
 * @since 27/02/2019
 */
public class ModuloDTO {

  private Long id;

  private String nome;

  private Set<FuncionalidadesDTO> funcionalidades = new HashSet<>();

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

  public Set<FuncionalidadesDTO> getFuncionalidades() {
    Set<FuncionalidadesDTO> funcionalidades = this.funcionalidades;
    return funcionalidades;
  }

  public void setFuncionalidades(Set<FuncionalidadesDTO> funcionalidades) {
    Set<FuncionalidadesDTO> funcionalidadess = funcionalidades;
    this.funcionalidades = funcionalidadess;
  }
}
