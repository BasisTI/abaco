package br.com.basis.abaco.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "vw_divergencia_resumo")
@Getter
@Setter
@AllArgsConstructor
public class VwResumoDivergencia extends VwResumoBase {

}
