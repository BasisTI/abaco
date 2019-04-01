import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Rx';

import {User} from './user.model';
import {UserService} from './user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'jhi-user-detail',
    templateUrl: './user-detail.component.html'
})
export class UserDetailComponent implements OnInit, OnDestroy {

    user: User;
    private subscription: Subscription;

    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
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

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
    }

    load(id) {
        this.userService.find(id).subscribe((user) => {
            this.user = user;
            if (this.user.authorities) {
                this.user.authorities.forEach((authority, index) => {
                    authority.artificialId = index;
                    switch (index) {
                        case 0: {
                            authority.description = this.getLabel('Cadastros.Usuarios.Administrador');
                            break;
                        }

                        case 1: {
                            authority.description = this.getLabel('Cadastros.Usuarios.Usuario');
                            break;
                        }

                        case 2: {
                            authority.description = this.getLabel('Cadastros.Usuarios.Observador');
                            break;
                        }

                        case 3: {
                            authority.description = this.getLabel('Cadastros.Usuarios.Analista');
                            break;
                        }
                    }
                });
            }
        });

    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
