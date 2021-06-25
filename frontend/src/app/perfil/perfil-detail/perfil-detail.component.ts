import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UploadService } from '../../upload/upload.service';
import { Perfil } from '../perfil.model';
import { PerfilService } from '../perfil.service';


@Component({
    selector: 'jhi-perfil-detail',
    templateUrl: './perfil-detail.component.html',
})
export class PerfilDetailComponent implements OnInit, OnDestroy {

    perfil: Perfil = new Perfil();
    private subscription: Subscription;

    constructor(
        private perfilService: PerfilService,
        private route: ActivatedRoute,
        private uploadService: UploadService,
    ) { }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
    }

    load(id) {
        this.perfilService.find(id).subscribe((perfil) => {
            this.perfil = perfil;
            this.perfil.permissaos.sort((a, b) => a.funcionalidadeAbaco.nome.localeCompare(b.funcionalidadeAbaco.nome));
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
