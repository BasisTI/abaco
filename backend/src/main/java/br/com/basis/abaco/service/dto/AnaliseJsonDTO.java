package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.*;
import br.com.basis.abaco.domain.audit.AbacoAudit;
import br.com.basis.abaco.domain.enumeration.MetodoContagem;
import br.com.basis.abaco.domain.enumeration.TipoAnalise;
import br.com.basis.dynamicexports.pojo.ReportObject;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldIndex;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
public class AnaliseJsonDTO implements Serializable {

    private Long id;
    private String numeroOs;
    private MetodoContagem metodoContagem;
    private String escopo;
    private String fronteiras;
    private String documentacao;
    private TipoAnalise tipoAnalise;
    private String propositoContagem;
    private String observacoes;
    private Timestamp dataCriacaoOrdemServico;
    private String identificadorAnalise;
    private Boolean isDivergence = false;
    private Sistema sistema;
    private Status status;
    private Contrato contrato;
    private Organizacao organizacao;
    private User createdBy;
    private Set<FuncaoDados> funcaoDados = new HashSet<>();
    private Set<FuncaoTransacao> funcaoTransacaos = new HashSet<>();
    private Set<EsforcoFase> esforcoFases;
    private TipoEquipe equipeResponsavel;
    private Manual manual;

}
