import { Analise } from './analise.class';
import { IInfoColunas } from './basecolunas.class';
import { BaseDados } from './basedados.class';

export interface IFiltro {
    conjunto: string;
    coluna: string;
    filtro: number;
}

export class Conjunto {

    coluna: string;
    nome: string;
    ids: Set<number>;
    outliers: Set<number>;
    analise: Analise;
    filtro: number; 

    constructor(nome:string, coluna:string){
        this.coluna = coluna;
        this.nome = nome;
        this.ids = new Set();
        this.outliers = new Set();
        this.filtro = 0;
    }
    addId(id:number){ this.ids.add(id); }
    addOutlier(id:number){ this.outliers.add(id) }
    removeOutlier(id:number){ this.outliers.delete(id) }   
}

export class BaseConjuntos {
    private _conjuntos:Conjunto[];

    constructor(){
        this._conjuntos = []
    }

    getConjuntos(coluna: string = null) {
        if (!coluna) return this._conjuntos.slice();
        return this._conjuntos.filter(g => g.coluna == coluna);
    }

    getConjunto(nome: string, coluna: string): Conjunto {
        let id_conj = ''
        if (nome.length == 0) {
            id_conj = '_vazios'
        } else {
            id_conj = isNaN(+nome) ? nome : '_numeros'
        }
        let conj = this._conjuntos.find(g => {
            if (g.coluna != coluna) return false
            if (g.nome != id_conj) return false
            return true
        })
        if (conj) return conj
        conj = new Conjunto(id_conj, coluna);
        this._conjuntos.push(conj)
        return conj
    }

    setFiltro(f: IFiltro): void {
        for (const conj of this._conjuntos) {
            if (f.conjunto == conj.nome && f.coluna == conj.coluna) conj.filtro = f.filtro
        }
    }

    getFiltros(): IFiltro[] {
        const filtrados = this._conjuntos.filter(x => x.filtro != 0)
        return filtrados.map(f => {
            return {
                conjunto: f.nome,
                coluna: f.coluna,
                filtro: f.filtro
            }
        })
    }

    getFuncaoFiltrar(ids_outliers:number[] = []) {
        let incluir = new Set<number>();
        let excluir = new Set<number>(ids_outliers);
        for (const g of this._conjuntos) {
            if (g.filtro > 0) for (const id of g.ids) incluir.add(id)
            if (g.filtro < 0) for (const id of g.ids) excluir.add(id)
        }
        if (incluir.size > 0 && excluir.size > 0) {
            return function (id: number) { return incluir.has(id) && !excluir.has(id) }
        } else if (incluir.size > 0) {
            return function (id: number) { return incluir.has(id) }
        } else if (excluir.size > 0) {
            return function (id: number) { return !excluir.has(id) }
        }
        return function (id: number) { return true }
    }

    calcularConjuntos(base:BaseDados, col:IInfoColunas, outliers:number[]=[]) {
        const fnFiltrar = this.getFuncaoFiltrar(outliers);
        for (const conj of this._conjuntos) {
            let ids = [...conj.ids].filter(fnFiltrar)
            if (col.metrica) {
                let ys = base.getValores(col.metrica, ids)
                let xs = col.variavel ? base.getValores(col.variavel, ids) : null;
                conj.analise = new Analise(ys, xs);
            } else if (conj.nome == '_numeros') {
                let ys = base.getValores(conj.coluna, ids)
                conj.analise = new Analise(ys, null);
            }
        }
    }


}