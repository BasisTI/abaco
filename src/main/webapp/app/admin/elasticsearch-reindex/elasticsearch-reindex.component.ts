import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiLanguageService } from 'ng-jhipster';

import { ElasticsearchReindexModalComponent } from './elasticsearch-reindex-modal.component';

@Component({
    selector: 'jhi-elasticsearch-reindex',
    templateUrl: './elasticsearch-reindex.component.html'
})
export class ElasticsearchReindexComponent {

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private modalService: NgbModal
    ) {
        this.jhiLanguageService.setLocations(['elasticsearch-reindex']);
    }

    showConfirm() {
        this.modalService.open(ElasticsearchReindexModalComponent);
    }
}
