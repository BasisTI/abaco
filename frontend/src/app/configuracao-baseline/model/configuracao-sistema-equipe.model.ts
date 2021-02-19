import { Sistema } from "src/app/sistema";
import { TipoEquipe } from "src/app/tipo-equipe";

export class ConfiguracaoSistemaEquipe{

    constructor(
        public sistemasDisponiveis?: Sistema[],
        public sistemasSelecionados?: Sistema[],
        public equipesDisponiveis?:TipoEquipe[],
        public equipesSelecionados?:TipoEquipe[]
    ) {
    }
}