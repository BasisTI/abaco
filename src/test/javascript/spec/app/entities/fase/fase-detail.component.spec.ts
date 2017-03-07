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
import { FaseDetailComponent } from '../../../../../../main/webapp/app/entities/fase/fase-detail.component';
import { FaseService } from '../../../../../../main/webapp/app/entities/fase/fase.service';
import { Fase } from '../../../../../../main/webapp/app/entities/fase/fase.model';

describe('Component Tests', () => {

    describe('Fase Management Detail Component', () => {
        let comp: FaseDetailComponent;
        let fixture: ComponentFixture<FaseDetailComponent>;
        let service: FaseService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [FaseDetailComponent],
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
                    FaseService
                ]
            }).overrideComponent(FaseDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(FaseDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(FaseService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Fase(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.fase).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
