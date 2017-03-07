import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService, DataUtils } from 'ng-jhipster';

import { Manual } from './manual.model';
import { ManualPopupService } from './manual-popup.service';
import { ManualService } from './manual.service';
import { EsforcoFase, EsforcoFaseService } from '../esforco-fase';
@Component({
    selector: 'jhi-manual-dialog',
    templateUrl: './manual-dialog.component.html'
})
export class ManualDialogComponent implements OnInit {

    manual: Manual;
    authorities: any[];
    isSaving: boolean;

    esforcofases: EsforcoFase[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private dataUtils: DataUtils,
        private alertService: AlertService,
        private manualService: ManualService,
        private esforcoFaseService: EsforcoFaseService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['manual']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.esforcoFaseService.query().subscribe(
            (res: Response) => { this.esforcofases = res.json(); }, (res: Response) => this.onError(res.json()));
    }
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData($event, manual, field, isImage) {
        if ($event.target.files && $event.target.files[0]) {
            let $file = $event.target.files[0];
            if (isImage && !/^image\//.test($file.type)) {
                return;
            }
            this.dataUtils.toBase64($file, (base64Data) => {
                manual[field] = base64Data;
                manual[`${field}ContentType`] = $file.type;
            });
        }
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.manual.id !== undefined) {
            this.manualService.update(this.manual)
                .subscribe((res: Manual) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.manualService.create(this.manual)
                .subscribe((res: Manual) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: Manual) {
        this.eventManager.broadcast({ name: 'manualListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError (error) {
        this.isSaving = false;
        this.onError(error);
    }

    private onError (error) {
        this.alertService.error(error.message, null, null);
    }

    trackEsforcoFaseById(index: number, item: EsforcoFase) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-manual-popup',
    template: ''
})
export class ManualPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private manualPopupService: ManualPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.manualPopupService
                    .open(ManualDialogComponent, params['id']);
            } else {
                this.modalRef = this.manualPopupService
                    .open(ManualDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
