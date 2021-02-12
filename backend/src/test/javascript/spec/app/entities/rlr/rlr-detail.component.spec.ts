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
import { RlrDetailComponent } from '../../../../../../main/webapp/app/entities/rlr/rlr-detail.component';
import { RlrService } from '../../../../../../main/webapp/app/entities/rlr/rlr.service';
import { Rlr } from '../../../../../../main/webapp/app/entities/rlr/rlr.model';

describe('Component Tests', () => {

    describe('Rlr Management Detail Component', () => {
        let comp: RlrDetailComponent;
        let fixture: ComponentFixture<RlrDetailComponent>;
        let service: RlrService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [RlrDetailComponent],
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
                    RlrService
                ]
            }).overrideComponent(RlrDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(RlrDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(RlrService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Rlr(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.rlr).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
