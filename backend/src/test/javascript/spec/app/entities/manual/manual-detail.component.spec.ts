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
import { ManualDetailComponent } from '../../../../../../main/webapp/app/entities/manual/manual-detail.component';
import { ManualService } from '../../../../../../main/webapp/app/entities/manual/manual.service';
import { Manual } from '../../../../../../main/webapp/app/entities/manual/manual.model';

describe('Component Tests', () => {

    describe('Manual Management Detail Component', () => {
        let comp: ManualDetailComponent;
        let fixture: ComponentFixture<ManualDetailComponent>;
        let service: ManualService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [ManualDetailComponent],
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
                    ManualService
                ]
            }).overrideComponent(ManualDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ManualDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ManualService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Manual(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.manual).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
