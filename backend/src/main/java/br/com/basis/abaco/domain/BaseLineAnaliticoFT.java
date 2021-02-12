package br.com.basis.abaco.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Immutable;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.Embeddable;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.io.Serializable;

/**
 * A BaseLineAnalitico Função de Transação.
 */

@Embeddable
@NoArgsConstructor
@Immutable
@Getter
@Setter
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@JsonInclude(JsonInclude.Include.NON_EMPTY)
@Entity
@Table(name = "baseline_analitico_ft")
@Document(indexName = "baseline_analitico_ft")
public class BaseLineAnaliticoFT extends BaseLineAnalitico implements Serializable  {

}
