package br.com.basis.abaco.service.relatorio;

import br.com.basis.abaco.domain.Permissao;
import br.com.basis.dynamicexports.constants.DynamicExportsConstants;
import br.com.basis.dynamicexports.pojo.ColunasPropriedadeRelatorio;
import br.com.basis.dynamicexports.pojo.PropriedadesRelatorio;

public class RelatorioPerfilColunas extends PropriedadesRelatorio {

    public RelatorioPerfilColunas() {
        super("Listagem de Perfil", "Total de Perfil");
        super.getColunas().add(new ColunasPropriedadeRelatorio("nome", "Nome", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        super.getColunas().add(new ColunasPropriedadeRelatorio("descricao", "Descrição", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        super.getColunas().add(new ColunasPropriedadeRelatorio("ativo", "Ativo", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
    }
}
