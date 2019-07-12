package br.com.basis.abaco.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class EsforcoFaseDTO {
    private static final long serialVersionUID = 1L;

    private BigDecimal esforco;

    private FaseDTO fase;
}
