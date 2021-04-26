package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.*;
import br.com.basis.abaco.domain.enumeration.Complexidade;
import br.com.basis.abaco.domain.enumeration.ImpactoFatorAjuste;
import br.com.basis.abaco.domain.enumeration.StatusFuncao;
import br.com.basis.abaco.domain.enumeration.TipoFuncaoTransacao;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.beanutils.BeanUtils;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * @author pedro.h.santos
 * @since 26/04/2021
 */
@Getter
@Setter
public class FuncaoTransacaoSaveDTO {

    private Long id;

    private Complexidade complexidade;

    private BigDecimal pf;

    private BigDecimal grossPF;

    private TipoFuncaoTransacao tipo;

    private Funcionalidade funcionalidade;

    private Set<Alr> alrs;

    private String ftrStr;

    private String detStr;

    private Integer quantidade;

    private FatorAjuste fatorAjuste;

    private String name;

    private String sustantation;

    private StatusFuncao statusFuncao;

    private Set<String> derValues = new HashSet<>();

    private List<UploadedFile> files = new ArrayList<>();

    private List<DivergenceCommentFuncaoTransacao> lstDivergenceComments = new ArrayList<>();

    private Set<String> ftrValues = new HashSet<>();

    private ImpactoFatorAjuste impacto;

    private Set<Der> ders = new HashSet<>();

    private Analise analise;

    public FuncaoTransacao toEntity() throws InvocationTargetException, IllegalAccessException {
        FuncaoTransacao funcaoTransacao = new FuncaoTransacao();
        BeanUtils.copyProperties(funcaoTransacao, this);
        return funcaoTransacao;
    }
}
