package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.EsforcoFase;
import br.com.basis.abaco.domain.FatorAjuste;
import br.com.basis.abaco.domain.Manual;
import br.com.basis.abaco.domain.UploadedFile;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.commons.beanutils.BeanUtils;

import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;


@Getter
@Setter
@NoArgsConstructor
public class ManualDTO {

    private Long id;

    private String nome;

    private String observacao;

    private BigDecimal valorVariacaoEstimada;

    private BigDecimal valorVariacaoIndicativa;

    private List<UploadedFile> arquivosManual = new LinkedList<>();

    private Set<EsforcoFase> esforcoFases = new LinkedHashSet<>();

    private Set<FatorAjuste> fatoresAjuste = new LinkedHashSet<>();

    private BigDecimal parametroInclusao;

    private BigDecimal parametroAlteracao;

    private BigDecimal parametroExclusao;

    private BigDecimal parametroConversao;

    private Long versaoCPM;

    public Manual toEntity() throws InvocationTargetException, IllegalAccessException {
        Manual manual = new Manual();
        BeanUtils.copyProperties(manual, this);
        return manual;
    }
}
