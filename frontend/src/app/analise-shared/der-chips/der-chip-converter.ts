import {DerChipItem} from './der-chip-item';
import {Der} from '../../der/der.model';
import {AnaliseReferenciavel} from '../analise-referenciavel';
import {Rlr} from '../../rlr/rlr.model';
import {Alr} from '../../alr/alr.model';

export class DerChipConverter {

    static desconverterEmDers(chips: DerChipItem[]): Der[] {
        return this.desconverter(chips, Der);
    }

    static desconverterEmRlrs(chips: DerChipItem[]): Rlr[] {
        return this.desconverter(chips, Rlr);
    }

    static desconverterEmAlrs(chips: DerChipItem[]): Alr[] {
        return this.desconverter(chips, Alr);
    }

    private static desconverter<T extends AnaliseReferenciavel>(
        chips: DerChipItem[], type: { new(): T; }): T[] {
        const referenciavel: T[] = [];
        if (chips) {
            chips.forEach(chipItem => {
                const ref = new type();
                ref.id = chipItem.id;

                // FIXME mais logica embolada
                // se length > 0 salvar como texto, ao inves de valor?
                // repensar a logica toda de nome/valor
                if (!isNaN(chipItem.text as any)) {
                    ref.valor = Number(chipItem.text);
                } else {
                    ref.nome = chipItem.text;
                }
                referenciavel.push(ref);
            });
        }
        return referenciavel;
    }

    static converterReferenciaveis(refs: AnaliseReferenciavel[]) {
        return refs.map(ref => new DerChipItem(ref.id, this.retrieveTextFromDER(ref)));
    }
    static convertertReferenciaveisToClone(refs: AnaliseReferenciavel[]) {
        return refs.map(ref => new DerChipItem(null, this.retrieveTextFromDER(ref)));
    }

    private static retrieveTextFromDER(ref: AnaliseReferenciavel): string {
        return ref.valor ? ref.valor.toString() : ref.nome;
    }

    static converter(valores: string[]): DerChipItem[] {
        if (valores) {
            return this.doConverter(valores);
        }
    }

    private static doConverter(valores: string[]): DerChipItem[] {
        return valores.map(val => {
            return new DerChipItem(undefined, val);
        });
    }

    static valor(refs: AnaliseReferenciavel[]): number {
        if (!refs) {
            return 0;
        } else if (refs.length === 1 && refs[0].valor) {
            return refs[0].valor;
        } else {
            return refs.length;
        }
    }

}
