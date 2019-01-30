import {Component, OnInit, OnDestroy, ViewChild, Input} from '@angular/core';
import {BaselineSintetico} from '../../baseline-sintetico.model';

@Component({
    selector: 'jhi-baseline-inf-sistema',
    templateUrl: './baseline-inf-sistema.component.html'
})
export class BaselineInfSistemaComponent implements OnInit, OnDestroy {

    @Input() sistema: BaselineSintetico = new BaselineSintetico();

    constructor(
    ) {
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
    }

}
