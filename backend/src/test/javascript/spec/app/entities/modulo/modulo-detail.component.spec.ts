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
import { ModuloDetailComponent } from '../../../../../../main/webapp/app/entities/modulo/modulo-detail.component';
import { ModuloService } from '../../../../../../main/webapp/app/entities/modulo/modulo.service';
import { Modulo } from '../../../../../../main/webapp/app/entities/modulo/modulo.model';

describe('Component Tests', () => {

    describe('Modulo Management Detail Component', () => {
        let comp: ModuloDetailComponent;
        let fixture: ComponentFixture<ModuloDetailComponent>;
        let service: ModuloService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [ModuloDetailComponent],
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
                    ModuloService
                ]
            }).overrideComponent(ModuloDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ModuloDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ModuloService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Modulo(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.modulo).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
