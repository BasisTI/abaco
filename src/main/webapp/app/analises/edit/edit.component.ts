import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
    selector: 'jhi-analisedit',
    templateUrl: './edit.component.html'
})
export class AnalisEditComponent implements OnInit {

    @ViewChild('staticTabs') staticTabs: TabsetComponent;

    public alertMe(): void {
        setTimeout(function (): void {
            alert('You\'ve selected the alert tab!');
        });
    }

    selectTab(tab_id: number) {
        this.staticTabs.tabs[tab_id].active = true;
    }

    disableEnable() {
        this.staticTabs.tabs[2].disabled = !this.staticTabs.tabs[2].disabled
    }

    ngOnInit () {
      
    }

   
}
