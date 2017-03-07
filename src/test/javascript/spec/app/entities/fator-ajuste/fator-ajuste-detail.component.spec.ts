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
import { FatorAjusteDetailComponent } from '../../../../../../main/webapp/app/entities/fator-ajuste/fator-ajuste-detail.component';
import { FatorAjusteService } from '../../../../../../main/webapp/app/entities/fator-ajuste/fator-ajuste.service';
import { FatorAjuste } from '../../../../../../main/webapp/app/entities/fator-ajuste/fator-ajuste.model';

describe('Component Tests', () => {

    describe('FatorAjuste Management Detail Component', () => {
        let comp: FatorAjusteDetailComponent;
        let fixture: ComponentFixture<FatorAjusteDetailComponent>;
        let service: FatorAjusteService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [FatorAjusteDetailComponent],
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
                    FatorAjusteService
                ]
            }).overrideComponent(FatorAjusteDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(FatorAjusteDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(FatorAjusteService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new FatorAjuste(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.fatorAjuste).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
