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
import { OrganizacaoDetailComponent } from '../../../../../../main/webapp/app/entities/organizacao/organizacao-detail.component';
import { OrganizacaoService } from '../../../../../../main/webapp/app/entities/organizacao/organizacao.service';
import { Organizacao } from '../../../../../../main/webapp/app/entities/organizacao/organizacao.model';

describe('Component Tests', () => {

    describe('Organizacao Management Detail Component', () => {
        let comp: OrganizacaoDetailComponent;
        let fixture: ComponentFixture<OrganizacaoDetailComponent>;
        let service: OrganizacaoService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [OrganizacaoDetailComponent],
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
                    OrganizacaoService
                ]
            }).overrideComponent(OrganizacaoDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(OrganizacaoDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OrganizacaoService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Organizacao(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.organizacao).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
