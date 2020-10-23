import { ColunasComponent } from '../components/colunas/colunas.component';
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
    analise: Analise;
    filtro: number;

    constructor(nome: string, coluna: string) {
        this.coluna = coluna;
        this.nome = nome;
        this.ids = new Set();
        this.filtro = 0;
    }
}

export class BaseConjuntos {
    private _conjuntos: Conjunto[];

    constructor() {
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

    getFuncaoFiltrar(ids_outliers: number[] = []) {

        let cols = this._conjuntos.reduce((filtros, conj) => {
            if (conj.filtro <= 0) return filtros;
            let id_col = filtros.colunas.findIndex((c)=> c == conj.coluna)
            if(id_col < 0) {
                filtros.colunas.push(conj.coluna);
                id_col = filtros.colunas.findIndex((c)=> c == conj.coluna);
                filtros.ids[id_col] = [];
            }
            for (const id of conj.ids) filtros.ids[id_col].push(id);
            return filtros
        }, {colunas: [], ids:[[]]})

        let prev = cols.ids.shift();
        let incluidos = cols.ids.reduce((prev, col) => {
            return prev.filter(id => col.includes(id))
        }, prev);

        let incluir = new Set(incluidos);
        let excluir = new Set<number>(ids_outliers);
        for (const g of this._conjuntos) {
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

    analisarConjuntos(base: BaseDados, col: IInfoColunas, outliers: number[] = []) {
        const fnFiltrar = this.getFuncaoFiltrar(outliers);
        for (const conj of this._conjuntos) {
            conj.analise = null;
            let ids = [...conj.ids].filter(fnFiltrar)
            if (ids.length == 0) return
            let xs = []; let ys = [];
            if (col.strings.includes(conj.coluna)) {
                ys = col.metrica ? base.getValores(col.metrica, ids) : [];
                xs = col.variavel ? base.getValores(col.variavel, ids) : [];
            }
            if (col.numeros.includes(conj.coluna)) {
                if (conj.coluna == col.metrica) {
                    xs = col.variavel ? base.getValores(col.variavel, ids) : [];
                    ys = base.getValores(conj.coluna, ids)
                } else if (conj.coluna == col.variavel) {
                    xs = base.getValores(conj.coluna, ids)
                } else {
                    ys = base.getValores(conj.coluna, ids)
                }

            }
            conj.analise = new Analise(ys, xs);
        }
    }


}