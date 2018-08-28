package br.com.basis.abaco.service.relatorio.cabecalho;

import br.com.basis.abaco.service.relatorio.AbacoCabecalhoRodapeRelatorio;
import br.com.basis.dynamicexports.pojo.CabecalhoRodapeRelatorioInterface;
import br.com.basis.dynamicexports.service.impl.DynamicExportsServiceImpl;
import br.com.basis.dynamicexports.util.DynamicExportsBuilder;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@Primary
public class AbacoDynamicExportsService extends DynamicExportsServiceImpl {

    private static final String REPORT_NOME_SISTEMA = "Ábaco - Sistema de Contagem de Pontos de Função";


    public AbacoDynamicExportsService(DynamicExportsBuilder dynamicExportsBuilder) {
        super(dynamicExportsBuilder);
    }

    @Override
    public CabecalhoRodapeRelatorioInterface obterCabecalhoRodapeRelatorio() {
        return new AbacoCabecalhoRodapeRelatorio(AbacoDynamicExportsService.REPORT_NOME_SISTEMA);
    }
}
