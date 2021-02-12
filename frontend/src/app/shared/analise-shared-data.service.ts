import { Injectable } from '@angular/core';
import { Analise } from '../analise/';

import * as _ from 'lodash';
import { Subject, Observable } from 'rxjs';
import { FuncaoDados } from '../funcao-dados';
import { FuncaoTransacao } from '../funcao-transacao';

@Injectable()
export class AnaliseSharedDataService {

  private saveSubject = new Subject<any>();
  private loadSubject = new Subject<any>();
  // TODO Esse evento listener pode ser desnecessário, pois um sistema nunca mudará para uma análise.
  private sistemaSelectedSubject = new Subject<any>();
  private funcaoAnaliseCarregadaSubject = new Subject<any>();
  private funcaoAnaliseDescarregadaSubject = new Subject<any>();

  isEdit = false;

  analise: Analise;

  currentFuncaoDados: FuncaoDados;
  currentFuncaoTransacao: FuncaoTransacao;

  init() {
    this.isEdit = false;
    this.analise = new Analise();
  }

  isContratoSelected(): boolean {
    if (this.analise) {
      return !_.isUndefined(this.analise.contrato);
    }
  }

  analiseSalva() {
    this.isEdit = true;
    this.saveSubject.next();
  }

  getSaveSubject(): Observable<any> {
    return this.saveSubject.asObservable();
  }

  analiseCarregada() {
    this.isEdit = true;
    this.loadSubject.next();
  }

  getLoadSubject(): Observable<any> {
    return this.loadSubject.asObservable();
  }

  sistemaSelecionado() {
    this.sistemaSelectedSubject.next();
  }

  getSistemaSelecionadoSubject(): Observable<any> {
    return this.sistemaSelectedSubject.asObservable();
  }

  funcaoAnaliseCarregada() {
    this.funcaoAnaliseCarregadaSubject.next();
  }

  getFuncaoAnaliseCarregadaSubject() {
    return this.funcaoAnaliseCarregadaSubject.asObservable();
  }

  funcaoAnaliseDescarregada() {
    this.funcaoAnaliseDescarregadaSubject.next();
  }

  getFuncaoAnaliseDescarregadaSubject() {
    return this.funcaoAnaliseDescarregadaSubject.asObservable();
  }
  
  manualSelecionado(): boolean{
    return !_.isUndefined(this.analise.manual);
  }



}
