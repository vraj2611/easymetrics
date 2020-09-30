import { IAnalise } from '../services/analise.service';

export class Grupo {

    coluna: string;
    nome: string;
    ids: Set<number>;
    outliers: Set<number>;
    media: number;
    minimo: number;
    maximo: number;
    coef_var: number;
    analise: IAnalise;

    constructor(nome:string, coluna:string){
        this.coluna = coluna;
        this.nome = nome;
        this.ids = new Set();
        this.outliers = new Set();
    }

    addId(id:number){
        this.ids.add(id);
    }

    addOutlier(id:number){
        this.outliers.add(id)
    }

    removeOutlier(id:number){
        this.outliers.delete(id)
    }

}