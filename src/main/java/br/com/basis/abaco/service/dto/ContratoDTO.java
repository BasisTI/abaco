package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.Contrato;
import br.com.basis.abaco.domain.Manual;
import br.com.basis.abaco.domain.ManualContrato;
import br.com.basis.abaco.domain.Organizacao;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

public class ContratoDTO {
    private static final long serialVersionUID = 1L;

    private static transient Logger log = LoggerFactory.getLogger(Contrato.class);

    @Id
    private Long id;

    private String numeroContrato;

    @JsonDeserialize(using = LocalDateDeserializer.class)
    private LocalDate dataInicioVigencia;

    @JsonDeserialize(using = LocalDateDeserializer.class)
    private LocalDate dataFimVigencia;

    @JsonIgnore
    private Manual manual;

    @JsonManagedReference
    private Set<ManualContrato> manualContrato = new HashSet<>();

    @JsonBackReference
    private Organizacao organization;

    @NotNull
    private Boolean ativo;

    @Column(name = "dias_de_garantia")
    private Integer diasDeGarantia;

}
