package br.com.basis.abaco.service.relatorio;

import java.util.List;

import br.com.basis.dynamicexports.constants.DynamicExportsConstants;
import br.com.basis.dynamicexports.pojo.ColunasPropriedadeRelatorio;
import br.com.basis.dynamicexports.pojo.PropriedadesRelatorio;

public class RelatorioOrganizacaoColunas extends PropriedadesRelatorio {

    public RelatorioOrganizacaoColunas(List<String> colunasVisiveis) {
        super("Listagem de Organizações", "Total de Organizações");
        if(colunasVisiveis.contains("sigla")) {
            super.getColunas().add(new ColunasPropriedadeRelatorio("sigla", "Sigla", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        }
        if(colunasVisiveis.contains("nome")) {
            super.getColunas().add(new ColunasPropriedadeRelatorio("nome", "Nome", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        }
        if(colunasVisiveis.contains("cnpj")) {
            super.getColunas().add(new ColunasPropriedadeRelatorio("cnpj", "CNPJ", String.class, 10, "##.###.###/####-##", DynamicExportsConstants.ALINHAR_DIREITA));
        }
        if(colunasVisiveis.contains("numeroOcorrencia")) {
            super.getColunas().add(new ColunasPropriedadeRelatorio("numeroOcorrencia", "Número da Ocorrência", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_DIREITA));
        }
        if(colunasVisiveis.contains("ativo")) {
            super.getColunas().add(new ColunasPropriedadeRelatorio("ativoString", "Ativo?", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        }

    }
}
