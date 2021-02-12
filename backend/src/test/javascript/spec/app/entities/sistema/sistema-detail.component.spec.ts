import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { DateUtils, DataUtils } from 'ng-jhipster';
import { JhiLanguageService } from 'ng-jhipster';
import { MockLanguageService } from '../../../helpers/mock-language.service';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { SistemaDetailComponent } from '../../../../../../main/webapp/app/entities/sistema/sistema-detail.component';
import { SistemaService } from '../../../../../../main/webapp/app/entities/sistema/sistema.service';
import { Sistema } from '../../../../../../main/webapp/app/entities/sistema/sistema.model';

describe('Component Tests', () => {

    describe('Sistema Management Detail Component', () => {
        let comp: SistemaDetailComponent;
        let fixture: ComponentFixture<SistemaDetailComponent>;
        let service: SistemaService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [SistemaDetailComponent],
                providers: [
                    MockBackend,
                    BaseRequestOptions,
                    DateUtils,
                    DataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    {
                        provide: Http,
                        useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
                            return new Http(backendInstance, defaultOptions);
                        },
                        deps: [MockBackend, BaseRequestOptions]
                    },
                    {
                        provide: JhiLanguageService,
                        useClass: MockLanguageService
                    },
                    SistemaService
                ]
            }).overrideComponent(SistemaDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SistemaDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SistemaService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Sistema(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.sistema).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
