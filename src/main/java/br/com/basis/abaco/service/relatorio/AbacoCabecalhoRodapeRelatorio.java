package br.com.basis.abaco.service.relatorio;

import br.com.basis.dynamicexports.pojo.CabecalhoRodapeRelatorioInterface;
import net.sf.dynamicreports.report.builder.component.VerticalListBuilder;

import static net.sf.dynamicreports.report.builder.DynamicReports.cmp;

public class AbacoCabecalhoRodapeRelatorio implements CabecalhoRodapeRelatorioInterface {

    public AbacoCabecalhoRodapeRelatorio(String nomeSistema) {
        super();
        this.nomeSistema = nomeSistema;
    }

    private String nomeSistema;

    public VerticalListBuilder build() {
        VerticalListBuilder cabecalho = cmp.verticalList();
        cabecalho.add(cmp.text(nomeSistema)).removeLineWhenBlank();
        return cabecalho;
    }
}
