/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { AbacoTestModule } from '../../../test.module';
import { OrganizacaoDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/organizacao/organizacao-delete-dialog.component';
import { OrganizacaoService } from '../../../../../../main/webapp/app/entities/organizacao/organizacao.service';

describe('Component Tests', () => {

    describe('Organizacao Management Delete Component', () => {
        let comp: OrganizacaoDeleteDialogComponent;
        let fixture: ComponentFixture<OrganizacaoDeleteDialogComponent>;
        let service: OrganizacaoService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [AbacoTestModule],
                declarations: [OrganizacaoDeleteDialogComponent],
                providers: [
                    OrganizacaoService
                ]
            })
            .overrideTemplate(OrganizacaoDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(OrganizacaoDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OrganizacaoService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        spyOn(service, 'delete').and.returnValue(Observable.of({}));

                        // WHEN
                        comp.confirmDelete(123);
                        tick();

                        // THEN
                        expect(service.delete).toHaveBeenCalledWith(123);
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
