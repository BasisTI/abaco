/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';

import { AbacoTestModule } from '../../../test.module';
import { OrganizacaoComponent } from '../../../../../../main/webapp/app/entities/organizacao/organizacao.component';
import { OrganizacaoService } from '../../../../../../main/webapp/app/entities/organizacao/organizacao.service';
import { Organizacao } from '../../../../../../main/webapp/app/entities/organizacao/organizacao.model';

describe('Component Tests', () => {

    describe('Organizacao Management Component', () => {
        let comp: OrganizacaoComponent;
        let fixture: ComponentFixture<OrganizacaoComponent>;
        let service: OrganizacaoService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [AbacoTestModule],
                declarations: [OrganizacaoComponent],
                providers: [
                    OrganizacaoService
                ]
            })
            .overrideTemplate(OrganizacaoComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(OrganizacaoComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OrganizacaoService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new Headers();
                headers.append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of({
                    json: [new Organizacao(123)],
                    headers
                }));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.organizacaos[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
