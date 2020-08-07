export class Resumo {

    pfAjustada: number;
    pfTotal: number;
    quantidadeTipo: number;
    sem: number;
    baixa: number;
    media: number;
    alta: number;
    inm: number;
    tipo: String;

    constructor(
            pfAjustada: number,
            pfTotal: number,
            quantidadeTipo: number,
            sem: number,
            baixa: number,
            media: number,
            alta: number,
            inm: number,
            tipo: String) {
                this.pfAjustada = pfAjustada;
                this.pfTotal = pfTotal;
                this.quantidadeTipo = quantidadeTipo;
                this.sem = sem;
                this.baixa = baixa;
                this.media = media;
                this.alta = alta;
                this.inm = inm;
                this.tipo = tipo;

        }

     static addTotalLine(lstResumo: Resumo[]): Resumo[] {
        let pfAjustada = 0;
        let pfTotal = 0;
        let quantidadeTipo = 0;
        let sem = 0;
        let baixa = 0;
        let media = 0;
        let alta = 0;
        let inm = 0;
        lstResumo.forEach(
            resumo => {
                pfAjustada =  Number(resumo.pfAjustada) + pfAjustada;
                pfTotal =   Number(resumo.pfTotal) + pfTotal;
                quantidadeTipo =  resumo.quantidadeTipo + quantidadeTipo;
                sem =  resumo.sem + sem;
                baixa =  resumo.baixa + baixa;
                media =  resumo.media + media;
                alta =  resumo.alta + alta;
                inm =  resumo.inm + inm;
            }
        );

        const totalResumo: Resumo = new Resumo( pfAjustada, pfTotal, quantidadeTipo, sem, baixa, media, alta, inm, 'Total').clone();
        lstResumo.push(totalResumo);
        return lstResumo;
    }

    clone(): Resumo {
        return new Resumo(
            this.pfAjustada,
            this.pfTotal,
            this.quantidadeTipo,
            this.sem,
            this.baixa,
            this.media,
            this.alta,
            this.inm,
            this.tipo
        );
    }

}
