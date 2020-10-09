
export enum Status {
    VARIAVEL = "Variavel",
    METRICA = "Métrica",
    GRUPO = "Grupo",
    NULO = ""
}

export class Coluna {
    nome: string;
    exibir: boolean;
    tipo: string;
    status: Status;
    distintos: number;
    menorvar:number;
    maiorvar:number;
    menorqtde: number;
    maiorqtde: number;

    constructor(nome: string) {
        this.nome = nome;
        this.status = Status.NULO;
        this.menorvar = 15;
        this.maiorvar = 30;
        this.menorqtde = 2;
        this.maiorqtde = 150;

    }

}

