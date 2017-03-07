import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AbacoOrganizacaoModule } from './organizacao/organizacao.module';
import { AbacoManualModule } from './manual/manual.module';
import { AbacoSistemaModule } from './sistema/sistema.module';
import { AbacoModuloModule } from './modulo/modulo.module';
import { AbacoFuncionalidadeModule } from './funcionalidade/funcionalidade.module';
import { AbacoAnaliseModule } from './analise/analise.module';
import { AbacoFatorAjusteModule } from './fator-ajuste/fator-ajuste.module';
import { AbacoRlrModule } from './rlr/rlr.module';
import { AbacoDerModule } from './der/der.module';
import { AbacoEsforcoFaseModule } from './esforco-fase/esforco-fase.module';
import { AbacoFaseModule } from './fase/fase.module';
import { AbacoContratoModule } from './contrato/contrato.module';
import { AbacoFuncaoDadosModule } from './funcao-dados/funcao-dados.module';
import { AbacoFuncaoTransacaoModule } from './funcao-transacao/funcao-transacao.module';
import { AbacoAlrModule } from './alr/alr.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        AbacoOrganizacaoModule,
        AbacoManualModule,
        AbacoSistemaModule,
        AbacoModuloModule,
        AbacoFuncionalidadeModule,
        AbacoAnaliseModule,
        AbacoFatorAjusteModule,
        AbacoRlrModule,
        AbacoDerModule,
        AbacoEsforcoFaseModule,
        AbacoFaseModule,
        AbacoContratoModule,
        AbacoFuncaoDadosModule,
        AbacoFuncaoTransacaoModule,
        AbacoAlrModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoEntityModule {}
