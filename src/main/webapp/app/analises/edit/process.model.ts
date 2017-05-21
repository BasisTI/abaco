/**
 * Created by Wizi on 21.05.2017.
 */

import { FatorAjuste} from '../../entities/fator-ajuste';
import { Funcionalidade} from '../../entities/funcionalidade';
import { Modulo } from '../../entities/modulo';
import { Complexity, LogicalFile } from "./enums";



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

}
