package br.com.basis.abaco.service.relatorio;

import br.com.basis.dynamicexports.pojo.CabecalhoRodapeRelatorioInterface;
import br.com.basis.dynamicexports.service.impl.DynamicExportsServiceImpl;
import br.com.basis.dynamicexports.util.DynamicExportsBuilder;

public class AbacoDynamicExportsService extends DynamicExportsServiceImpl {

    private static final String REPORT_NOME_SISTEMA = "Ábaco";


    public AbacoDynamicExportsService(DynamicExportsBuilder dynamicExportsBuilder) {
        super(dynamicExportsBuilder);
    }

    @Override
    public CabecalhoRodapeRelatorioInterface obterCabecalhoRodapeRelatorio() {
        return new AbacoCabecalhoRodapeRelatorio(AbacoDynamicExportsService.REPORT_NOME_SISTEMA);
    }
}
