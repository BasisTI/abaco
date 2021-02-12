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
import { DerDetailComponent } from '../../../../../../main/webapp/app/entities/der/der-detail.component';
import { DerService } from '../../../../../../main/webapp/app/entities/der/der.service';
import { Der } from '../../../../../../main/webapp/app/entities/der/der.model';

describe('Component Tests', () => {

    describe('Der Management Detail Component', () => {
        let comp: DerDetailComponent;
        let fixture: ComponentFixture<DerDetailComponent>;
        let service: DerService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [DerDetailComponent],
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
                    DerService
                ]
            }).overrideComponent(DerDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DerDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DerService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Der(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.der).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
