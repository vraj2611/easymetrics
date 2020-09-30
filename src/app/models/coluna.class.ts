
export enum Status {
    VARIAVEL = "Variavel",
    METRICA = "Métrica",
    GRUPO = "Grupo",
    NULO = ""
}

export interface IRegistro {
    _id: number;
    _outlier: boolean;
    _filtro: boolean;
    _obs: string;
}

export class Coluna {
    nome: string;
    exibir: boolean;
    tipo: string;
    status: Status;

    constructor(nome: string) {
        this.nome = nome;
        this.status = Status.NULO;
    }

}

