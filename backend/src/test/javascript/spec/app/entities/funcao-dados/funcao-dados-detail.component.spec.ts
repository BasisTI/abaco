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
import { FuncaoDadosDetailComponent } from '../../../../../../main/webapp/app/entities/funcao-dados/funcao-dados-detail.component';
import { FuncaoDadosService } from '../../../../../../main/webapp/app/entities/funcao-dados/funcao-dados.service';
import { FuncaoDados } from '../../../../../../main/webapp/app/entities/funcao-dados/funcao-dados.model';

describe('Component Tests', () => {

    describe('FuncaoDados Management Detail Component', () => {
        let comp: FuncaoDadosDetailComponent;
        let fixture: ComponentFixture<FuncaoDadosDetailComponent>;
        let service: FuncaoDadosService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [FuncaoDadosDetailComponent],
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
                    FuncaoDadosService
                ]
            }).overrideComponent(FuncaoDadosDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(FuncaoDadosDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(FuncaoDadosService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new FuncaoDados(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.funcaoDados).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
