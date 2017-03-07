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
import { AnaliseDetailComponent } from '../../../../../../main/webapp/app/entities/analise/analise-detail.component';
import { AnaliseService } from '../../../../../../main/webapp/app/entities/analise/analise.service';
import { Analise } from '../../../../../../main/webapp/app/entities/analise/analise.model';

describe('Component Tests', () => {

    describe('Analise Management Detail Component', () => {
        let comp: AnaliseDetailComponent;
        let fixture: ComponentFixture<AnaliseDetailComponent>;
        let service: AnaliseService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [AnaliseDetailComponent],
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
                    AnaliseService
                ]
            }).overrideComponent(AnaliseDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(AnaliseDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AnaliseService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Analise(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.analise).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
