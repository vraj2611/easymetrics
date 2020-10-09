import { Analise } from './analise.class';

export class Grupo {

    coluna: string;
    nome: string;
    ids: Set<number>;
    outliers: Set<number>;
    media: number;
    minimo: number;
    maximo: number;
    coef_var: number;
    analise: Analise;
    filtro: number;

    constructor(nome:string, coluna:string){
        this.coluna = coluna;
        this.nome = nome;
        this.ids = new Set();
        this.outliers = new Set();
        this.filtro = 0;
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