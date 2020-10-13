import { Analise } from './analise.class'
import { Coluna, Status } from './coluna.class'
import { Conjunto } from './conjunto.class'

export interface IRegistro {
    _id: number;
    _outlier: boolean;
    _filtro: boolean;
    _obs: string;
}

export interface IFiltro {
    conjunto: string;
    coluna: string;
    filtro: number;
}

export interface IDataset {
    label: string;
    xs: number[];
    ys: number[];
}

export class BaseDados {

    private _registros: IRegistro[]
    private _colunas: Coluna[]
    private _conjuntos: Conjunto[]
    private _datasets: IDataset[]

    constructor(dados: any[]) {
        this._colunas = [];
        this._conjuntos = [];
        this._registros = [];
        this._datasets = [];
        this.carregar(dados);
        for (const c of this._colunas) {
            c.tipo = this.definirTipoColuna(c.nome)
        }
        this.calcularConjuntos();
    }

    getColunas() {
        return this._colunas.slice();
    }

    getConjuntos(coluna: string = null) {
        if (!coluna) return this._conjuntos.slice();
        return this._conjuntos.filter(g => g.coluna == coluna);
    }

    getRegistros() {
        return this._registros.slice();
    }

    getDatasets(){
        return this._datasets.slice();
    }

    combinarColunas(coluna1: string, coluna2: string) {

    }

    segmentarNumeros(coluna: string, limites_sup: number[]) {

    }

    setStatus(nome_coluna: string, status: Status) {
        for (const c of this._colunas) {
            if (c.nome == nome_coluna){
                c.status = (c.status == status) ? Status.NULO : status
            } else {
                if (c.status == status) c.status = Status.NULO
            }
        }
        this.calcularConjuntos();
    }

    private getColuna(nome: string): Coluna {
        let col = this._colunas.find(c => c.nome == nome);
        if (col) return col
        col = new Coluna(nome);
        this._colunas.push(col)
        return col;
    }

    getValores(coluna: string, ids: number[] = null) {
        if (ids) return ids.map(i => this._registros[i][coluna])
        return this._registros.map(r => r[coluna]);
    }

    private definirTipoColuna(coluna: string): string {
        let grupos_col = this._conjuntos.filter(g => g.coluna == coluna);
        let nums = grupos_col.filter(g => g.nome == '_numeros')
        if (nums.length > 0) return 'Numero';
        let strs = grupos_col.filter(g => g.nome != '_numeros')
        if (strs.length > 0) return 'String';
    }

    private getConjunto(nome: string, coluna: string): Conjunto {
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

    private carregar(dados: IRegistro[]) {
        dados.map((reg, index) => {
            for (const key in reg) {
                let col = this.getColuna(key);
                let conj = this.getConjunto(reg[key], col.nome)
                conj.addId(index)
            }
            reg._id = index
            reg._filtro = true;
            reg._outlier = false;
            reg._obs = '';
            this._registros.push(reg)
        })

    }

    private calcularColunas() {

        for (const c of this._colunas) {
            c.maiorqtde = 0;
            c.menorqtde = 999;
            c.maiorvar = 0;
            c.menorvar = 999;
            let gcol = this._conjuntos.filter(g => g.coluna == c.nome)
            gcol.map(g => {
                let q = g.ids.size;
                c.maiorqtde = (q > c.maiorqtde) ? q : c.maiorqtde;
                c.menorqtde = (q < c.menorqtde) ? q : c.menorqtde;
                if ((q > 1) && g.analise?.y?.coef_var) {
                    let v = Math.round(100 * g.analise.y.coef_var);
                    if (v > 0) {
                        c.maiorvar = (v > c.maiorvar) ? v : c.maiorvar;
                        c.menorvar = (v < c.menorvar) ? v : c.menorvar;
                    }
                }

            })
            c.distintos = gcol.length;
        }
    }

    private calcularConjuntos(ids: number[] = null) {
        let col_metr = this._colunas.find(c => c.status == Status.METRICA);
        let col_var = this._colunas.find(c => c.status == Status.VARIAVEL);
        let col_grupo = this._colunas.find(c => c.status == Status.GRUPO);
        const fnFiltrar = this.getFuncaoFiltrar();
        const datasets: IDataset[] = [];
        for (const conj of this._conjuntos) {
            let ids = [...conj.ids].filter(fnFiltrar)
            if (col_metr) {
                let ys = this.getValores(col_metr.nome, ids)
                let xs = col_var ? this.getValores(col_var.nome, ids) : null;
                conj.analise = new Analise(ys, xs);
                if (col_grupo && (conj.coluna == col_grupo.nome)) {
                    datasets.push({
                        label: conj.nome,
                        xs: xs,
                        ys: ys
                    })
                }
                if (!col_grupo && (conj.coluna == col_metr.nome)) {
                    datasets.push({
                        label: conj.nome,
                        xs: xs,
                        ys: ys
                    })
                }

            } else if (conj.nome == '_numeros') {
                let ys = this.getValores(conj.coluna, ids)
                conj.analise = new Analise(ys, null);
            }
        }
        this.calcularColunas();
        this._datasets = datasets;

    }

    toogleOutlier(id: number) {
        for (const reg of this._registros) {
            if (reg._id == id) reg._outlier = !reg._outlier
        }
        this.calcularConjuntos([id]);
    }

    setFiltro(f: IFiltro): IFiltro[] {
        for (const x of this._conjuntos) {
            if (f.conjunto == x.nome && f.coluna == x.coluna) x.filtro = f.filtro
        }
        this.calcularConjuntos();
        return this.getFiltros();
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

    private getFuncaoFiltrar() {
        let incluir = new Set<number>();
        let outliers = this._registros.filter(r => r._outlier).map(r => r._id);
        let excluir = new Set<number>(outliers);
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

}