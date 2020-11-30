package br.com.basis.abaco.domain;

import org.hibernate.annotations.Immutable;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.Entity;
import java.io.Serializable;

/**
 * A BaseLineAnalitico Função de Dado.
 */

@Entity
@Immutable
@Document(indexName = "baseline_analitico_fd")
public class BaseLineAnaliticoFD extends BaseLineAnalitico implements Serializable {

}

