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
import { FuncaoTransacaoDetailComponent } from '../../../../../../main/webapp/app/entities/funcao-transacao/funcao-transacao-detail.component';
import { FuncaoTransacaoService } from '../../../../../../main/webapp/app/entities/funcao-transacao/funcao-transacao.service';
import { FuncaoTransacao } from '../../../../../../main/webapp/app/entities/funcao-transacao/funcao-transacao.model';

describe('Component Tests', () => {

    describe('FuncaoTransacao Management Detail Component', () => {
        let comp: FuncaoTransacaoDetailComponent;
        let fixture: ComponentFixture<FuncaoTransacaoDetailComponent>;
        let service: FuncaoTransacaoService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [FuncaoTransacaoDetailComponent],
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
                    FuncaoTransacaoService
                ]
            }).overrideComponent(FuncaoTransacaoDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(FuncaoTransacaoDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(FuncaoTransacaoService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new FuncaoTransacao(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.funcaoTransacao).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
