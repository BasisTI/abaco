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
import { FuncionalidadeDetailComponent } from '../../../../../../main/webapp/app/entities/funcionalidade/funcionalidade-detail.component';
import { FuncionalidadeService } from '../../../../../../main/webapp/app/entities/funcionalidade/funcionalidade.service';
import { Funcionalidade } from '../../../../../../main/webapp/app/entities/funcionalidade/funcionalidade.model';

describe('Component Tests', () => {

    describe('Funcionalidade Management Detail Component', () => {
        let comp: FuncionalidadeDetailComponent;
        let fixture: ComponentFixture<FuncionalidadeDetailComponent>;
        let service: FuncionalidadeService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [FuncionalidadeDetailComponent],
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
                    FuncionalidadeService
                ]
            }).overrideComponent(FuncionalidadeDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(FuncionalidadeDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(FuncionalidadeService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Funcionalidade(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.funcionalidade).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
