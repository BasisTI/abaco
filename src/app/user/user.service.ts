import { TipoEquipe } from './../tipo-equipe/tipo-equipe.model';
import { Organizacao } from './../organizacao/organizacao.model';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';

import { User } from './user.model';
import { Authority } from './authority.model';
import { ResponseWrapper, createRequestOption, JhiDateUtils } from '../shared';

@Injectable()
export class UserService {

  resourceUrl = environment.apiUrl + '/users';

  authoritiesUrl = this.resourceUrl + '/authorities';

  searchUrl = environment.apiUrl + '/_search/users';

  constructor(private http: HttpService) { }

  create(user: User): Observable<User> {
    const copy = this.convert(user);
    return this.http.post(this.resourceUrl, copy).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertItemFromServer(jsonResponse);
    });
  }

  update(user: User): Observable<User> {
    const copy = this.convert(user);
    return this.http.put(this.resourceUrl, copy).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertItemFromServer(jsonResponse);
    });
  }

  find(id: number): Observable<User> {
    return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertItemFromServer(jsonResponse);
    });
  }

  getAllUsers(org: Organizacao, tipoequip: TipoEquipe): Observable<User[]> {
    return this.http.get(`${this.resourceUrl}/${org.id}/${tipoequip.id}`).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertUsersFromServer(jsonResponse);
    });
  }

  /**
   * Função que retorna dados do usuário logado
   */
  findCurrentUser(): Observable<User> {
    return this.http.get(`${this.resourceUrl}/logged`).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertItemFromServer(jsonResponse);
    });
  }

  /**
   * Função que retorna dados do usuário logado somente com as organizações ativas
   */
  findCurrentUserActiveOrgs(): Observable<User> {
    return this.http.get(`${this.resourceUrl}/activeorgs`).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertItemFromServer(jsonResponse);
    });
  }

  query(req?: any): Observable<ResponseWrapper> {
    const options = createRequestOption(req);
    return this.http.get(this.resourceUrl, options)
      .map((res: Response) => this.convertResponse(res));
  }

  delete(user: User): Observable<Response> {
    return this.http.delete(`${this.resourceUrl}/${user.id}`);
  }

  authorities(): Observable<Authority[]> {
    return this.http.get(`${this.authoritiesUrl}`)
      .map(res => {
        return res.json().map(item => {
          return new Authority(item.name);
        });
      });
  }

  private convertResponse(res: Response): ResponseWrapper {
    const jsonResponse = res.json();
    const result = [];
    for (let i = 0; i < jsonResponse.length; i++) {
      result.push(this.convertItemFromServer(jsonResponse[i]));
    }
    return new ResponseWrapper(res.headers, result, res.status);
  }

  /**
   * Convert a returned JSON object to User.
   */
  private convertItemFromServer(json: any): User {
    const entity: User = Object.assign(new User(), json);
    entity.authorities = this.generateAuthorities(json);
    return entity;
  }

  /**
   * Convert a returned JSON object to User.
   */
  private convertUsersFromServer(json: any): User[] {
    const users: User[] = [];
    json.map(item => {
      const entity: User = Object.assign(new User(), item);
      entity.authorities = this.generateAuthorities(item);
      users.push(entity);
    })
    return users;
  }

  // TODO User implements JSONable
  private generateAuthorities(json: any) {
    let authorities: Authority[] = [];
    if (json.authorities) {
      authorities = json.authorities.map(a => new Authority(a.name));
    }
    return authorities;
  }

  /**
   * Convert a User to a JSON which can be sent to the server.
   */
  private convert(user: User): User {
    const copy: User = Object.assign({}, user);
    return copy;
  }
}
