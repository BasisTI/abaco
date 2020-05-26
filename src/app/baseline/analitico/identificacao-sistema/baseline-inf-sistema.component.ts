import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { BaselineSintetico } from '../../baseline-sintetico.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'jhi-baseline-inf-sistema',
    templateUrl: './baseline-inf-sistema.component.html'
})
export class BaselineInfSistemaComponent {

    @Input() sistema: BaselineSintetico = new BaselineSintetico();

    constructor(
        private translate: TranslateService
    ) {
    }

    getLabel(label) {
        let str: any;
        this.translate.get(label).subscribe((res: string) => {
            str = res;
        }).unsubscribe();
        return str;
    }

}
