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
import { AlrDetailComponent } from '../../../../../../main/webapp/app/entities/alr/alr-detail.component';
import { AlrService } from '../../../../../../main/webapp/app/entities/alr/alr.service';
import { Alr } from '../../../../../../main/webapp/app/entities/alr/alr.model';

describe('Component Tests', () => {

    describe('Alr Management Detail Component', () => {
        let comp: AlrDetailComponent;
        let fixture: ComponentFixture<AlrDetailComponent>;
        let service: AlrService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [AlrDetailComponent],
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
                    AlrService
                ]
            }).overrideComponent(AlrDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(AlrDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AlrService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Alr(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.alr).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
