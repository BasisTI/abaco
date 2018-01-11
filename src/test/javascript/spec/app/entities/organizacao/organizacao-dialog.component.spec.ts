/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { AbacoTestModule } from '../../../test.module';
import { OrganizacaoDialogComponent } from '../../../../../../main/webapp/app/entities/organizacao/organizacao-dialog.component';
import { OrganizacaoService } from '../../../../../../main/webapp/app/entities/organizacao/organizacao.service';
import { Organizacao } from '../../../../../../main/webapp/app/entities/organizacao/organizacao.model';
import { ContratoService } from '../../../../../../main/webapp/app/entities/contrato';

describe('Component Tests', () => {

    describe('Organizacao Management Dialog Component', () => {
        let comp: OrganizacaoDialogComponent;
        let fixture: ComponentFixture<OrganizacaoDialogComponent>;
        let service: OrganizacaoService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [AbacoTestModule],
                declarations: [OrganizacaoDialogComponent],
                providers: [
                    ContratoService,
                    OrganizacaoService
                ]
            })
            .overrideTemplate(OrganizacaoDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(OrganizacaoDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OrganizacaoService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Organizacao(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(entity));
                        comp.organizacao = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'organizacaoListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Organizacao();
                        spyOn(service, 'create').and.returnValue(Observable.of(entity));
                        comp.organizacao = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'organizacaoListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
