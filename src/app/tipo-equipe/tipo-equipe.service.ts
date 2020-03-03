import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {HttpService} from '@basis/angular-components';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs/Rx';
import {environment} from '../../environments/environment';
import {createRequestOption, PageNotificationService, ResponseWrapper} from '../shared';
import {TipoEquipe} from './tipo-equipe.model';


@Injectable()
export class TipoEquipeService {

    resourceUrl = environment.apiUrl + '/tipo-equipes';

    findByOrganizacaoAndUserUrl = this.resourceUrl + '/current-user';
    findByOrganizacaoUrl = this.resourceUrl + '/organizacoes';
    findAllCompartilhaveisUrl = this.resourceUrl + '/compartilhar';

    searchUrl = environment.apiUrl + '/_search/tipo-equipes';

    constructor(private http: HttpService, private pageNotificationService: PageNotificationService, private translate: TranslateService) {
    }

    getLabel(label) {
        let str: any;
        this.translate.get(label).subscribe((res: string) => {
            str = res;
        }).unsubscribe();
        return str;
    }

    create(tipoEquipe: TipoEquipe): Observable<TipoEquipe> {
        const copy = this.convert(tipoEquipe);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        }).catch((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                return Observable.throw(new Error(error.status));
            }
        });
    }

    update(tipoEquipe: TipoEquipe): Observable<TipoEquipe> {
        const copy = this.convert(tipoEquipe);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        }).catch((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                return Observable.throw(new Error(error.status));
            }
        });
    }

    find(id: number): Observable<TipoEquipe> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        }).catch((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                return Observable.throw(new Error(error.status));
            }
        });
    }

    getAll(): Observable<ResponseWrapper> {
        const url = `${this.findByOrganizacaoUrl}`;
        return this.http.get(url).map((res: Response) => this.convertResponse(res)).catch((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                return Observable.throw(new Error(error.status));
            }
        });
    }

    findAllByOrganizacaoId(orgId: number): Observable<ResponseWrapper> {
        const url = `${this.findByOrganizacaoUrl}/${orgId}`;
        return this.http.get(url).map((res: Response) => this.convertResponse(res)).catch((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                return Observable.throw(new Error(error.status));
            }
        });
    }

    findAllEquipesByOrganizacaoIdAndLoggedUser(orgId: number): Observable<ResponseWrapper> {
        const url = `${this.findByOrganizacaoAndUserUrl}/${orgId}`;
        return this.http.get(url).map((res: Response) => this.convertResponse(res)).catch((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                return Observable.throw(new Error(error.status));
            }
        });
    }

    findAllCompartilhaveis(orgId, analiseId, equipeId: number): Observable<ResponseWrapper> {
        const url = `${this.findAllCompartilhaveisUrl}/${orgId}/${analiseId}/${equipeId}`;
        return this.http.get(url).map((res: Response) => this.convertResponse(res)).catch((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                return Observable.throw(new Error(error.status));
            }
        });
    }

    dropDown(): Observable<ResponseWrapper> {
        return this.http.get(this.resourceUrl + '/drop-down').map((res: Response) => this.convertResponse(res)).catch((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                return Observable.throw(new Error(error.status));
            }
        });
    }

    getEquipesActiveLoggedUser(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl + '/active-user', options)
            .map((res: Response) => this.convertResponse(res)).catch((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                    return Observable.throw(new Error(error.status));
                }
            });
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    private convertItemFromServer(json: any): TipoEquipe {
        const entity: TipoEquipe = Object.assign(new TipoEquipe(), json);
        return entity;
    }

    private convert(tipoEquipe: TipoEquipe): TipoEquipe {
        const copy: TipoEquipe = Object.assign({}, tipoEquipe);
        return copy;
    }
}
