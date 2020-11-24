package br.com.basis.abaco.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Immutable;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Embeddable;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;
import java.io.Serializable;

/**
 * A BaseLineAnalitico Função de Dado.
 */
@Table(name = "baseline_analitico_fd")
@Document(indexName = "baseline_analitico_fd")
@Immutable
@Getter
@Setter
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@EntityListeners(AuditingEntityListener.class)
@Embeddable
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_EMPTY)
@Entity
public class BaseLineAnaliticoFD extends BaseLineAnalitico implements Serializable {

}
