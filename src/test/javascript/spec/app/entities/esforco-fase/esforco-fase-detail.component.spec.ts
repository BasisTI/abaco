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
import { EsforcoFaseDetailComponent } from '../../../../../../main/webapp/app/entities/esforco-fase/esforco-fase-detail.component';
import { EsforcoFaseService } from '../../../../../../main/webapp/app/entities/esforco-fase/esforco-fase.service';
import { EsforcoFase } from '../../../../../../main/webapp/app/entities/esforco-fase/esforco-fase.model';

describe('Component Tests', () => {

    describe('EsforcoFase Management Detail Component', () => {
        let comp: EsforcoFaseDetailComponent;
        let fixture: ComponentFixture<EsforcoFaseDetailComponent>;
        let service: EsforcoFaseService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [EsforcoFaseDetailComponent],
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
                    EsforcoFaseService
                ]
            }).overrideComponent(EsforcoFaseDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(EsforcoFaseDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EsforcoFaseService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new EsforcoFase(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.esforcoFase).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
