/**
 * Created by Wizi on 21.05.2017.
 */

import { FatorAjuste} from '../../entities/fator-ajuste';
import { Funcionalidade} from '../../entities/funcionalidade';
import { Modulo } from '../../entities/modulo';
import {Complexity, LogicalFile, OutputTypes} from "./enums";



export class Process{
    public id:number;
    public factor:FatorAjuste;
    public module:Modulo;
    public func:Funcionalidade;
    public name:String;
    public classification:number;
    public ret:number;
    public det:number;
    public complexity:Complexity;
    public pf:number;

    public calculate(){
        if (this.ret==1) {
            if (this.det<=50) {
                this.complexity = Complexity.LOW;
            } else {
                this.complexity = Complexity.MEDIUM;
            }
        }

        if (this.ret>=2 && this.ret<=5) {
            if (this.det<=19) {
                this.complexity = Complexity.LOW;
            }

            if (this.det>=20 && this.det<=50) {
                this.complexity = Complexity.MEDIUM;
            }
            if (this.det>=51) {
                this.complexity = Complexity.HIGH;
            }
        }

        if (this.ret>=6) {
            if (this.det<=19) {
                this.complexity = Complexity.MEDIUM;
            }

            if (this.det>=20) {
                this.complexity = Complexity.HIGH;
            }
        }

        if (this.classification == LogicalFile.ILF) {

            switch (this.complexity) {
                case Complexity.LOW:{
                    this.pf=7;
                    break;
                }
                case Complexity.MEDIUM:{
                    this.pf=10;
                    break;
                }
                case Complexity.HIGH:{
                    this.pf=15;
                    break;
                }
                default: this.pf=7;
            }
        } else {
            switch (this.complexity) {
                case Complexity.LOW:{
                    this.pf=5;
                    break;
                }
                case Complexity.MEDIUM:{
                    this.pf=7;
                    break;
                }
                case Complexity.HIGH:{
                    this.pf=10;
                    break;
                }
                default: this.pf=5;
            }
        }


    }


    public calculateTran(){



        if (this.classification == OutputTypes.EO || this.classification == OutputTypes.EI) {

            if (this.ret==0 || this.ret==1 ) {
                if (this.det<=15) {
                    this.complexity = Complexity.LOW;
                } else {
                    this.complexity = Complexity.MEDIUM;
                }
            }

            if (this.ret==2 ) {
                if (this.det<=4) {
                    this.complexity = Complexity.LOW;
                }

                if (this.det>=5 && this.det<=15) {
                    this.complexity = Complexity.MEDIUM;
                }
                if (this.det>=16) {
                    this.complexity = Complexity.HIGH;
                }
            }


            if (this.ret>=3 ) {
                if (this.det<=4) {
                    this.complexity = Complexity.MEDIUM;
                }

                if (this.det>=5) {
                    this.complexity = Complexity.HIGH;
                }
            }

        } else {

            if (this.ret==0 || this.ret==1 ) {
                if (this.det<=19) {
                    this.complexity = Complexity.LOW;
                } else {
                    this.complexity = Complexity.MEDIUM;
                }
            }

            if (this.ret==2 || this.ret==3 ) {
                if (this.det<=5) {
                    this.complexity = Complexity.LOW;
                }

                if (this.det>=6 && this.det<=19) {
                    this.complexity = Complexity.MEDIUM;
                }
                if (this.det>=20) {
                    this.complexity = Complexity.HIGH;
                }
            }


            if (this.ret>=4 ) {
                if (this.det<=5) {
                    this.complexity = Complexity.MEDIUM;
                }

                if (this.det>=6) {
                    this.complexity = Complexity.HIGH;
                }
            }


        }

        if (this.classification == OutputTypes.EI || this.classification == OutputTypes.EQ) {

            switch (this.complexity) {
                case Complexity.LOW:{
                    this.pf=3;
                    break;
                }
                case Complexity.MEDIUM:{
                    this.pf=4;
                    break;
                }
                case Complexity.HIGH:{
                    this.pf=5;
                    break;
                }
                default: this.pf=3;
            }
        } else {
            switch (this.complexity) {
                case Complexity.LOW:{
                    this.pf=4;
                    break;
                }
                case Complexity.MEDIUM:{
                    this.pf=5;
                    break;
                }
                case Complexity.HIGH:{
                    this.pf=7;
                    break;
                }
                default: this.pf=4;
            }
        }


    }



}
