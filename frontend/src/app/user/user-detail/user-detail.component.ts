import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { Subscription } from 'rxjs';


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
    ) {
    }

    getLabel(label) {
        return label;
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
                            authority.description = 'Administrador';
                            break;
                        }

                        case 1: {
                            authority.description = 'Usuario';
                            break;
                        }

                        case 2: {
                            authority.description = 'Observador';
                            break;
                        }

                        case 3: {
                            authority.description = 'Analista';
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
