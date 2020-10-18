import { BaseConjuntos, IFiltro } from './baseconjuntos.class'
import { BaseColunas, Status } from './basecolunas.class'

export interface IRegistro {
    _id: number;
    _outlier: boolean;
    _filtro: boolean;
    _obs: string;
}

export interface IDataset {
    label: string;
    xs: number[];
    ys: number[];
    data: any[];
}

export class BaseDados {

    private _registros: IRegistro[]
    private _basecolunas: BaseColunas;
    private _baseconjuntos: BaseConjuntos;
    private _datasets: IDataset[]

    constructor(registros: any[]) {
        this._basecolunas = new BaseColunas();
        this._baseconjuntos = new BaseConjuntos();
        this._registros = [];
        this._datasets = [];
        this.carregar(registros);
        let conjs = this._baseconjuntos.getConjuntos();
        this._basecolunas.classificarColunas(conjs);
        this.calcularConjuntos();
    }

    getColunas() {
        return this._basecolunas.getColunas();
    }

    getConjuntos(coluna: string = null) {
        return this._baseconjuntos.getConjuntos(coluna);
    }

    getRegistros() {
        return this._registros.slice();
    }

    getDatasets() {
        return this._datasets.slice();
    }

    combinarColunas(coluna1: string, coluna2: string) {

    }

    segmentarNumeros(coluna: string, limites_sup: number[]) {

    }

    setStatus(nome_coluna: string, status: Status) {
        this._basecolunas.setStatus(nome_coluna, status);
        this.calcularConjuntos();
    }

    getNumeros() {
        let cols = this._basecolunas.getInfo().numeros;
        let valores = {}
        for (const col of cols) valores[col] = []
        for (const reg of this._registros) {
            for (const col of cols) valores[col].push(this._registros[col])
        }
        return valores
    }

    getValores(coluna: string, ids: number[] = null) {
        if (ids) return ids.map(i => this._registros[i][coluna])
        return this._registros.map(r => r[coluna]);
    }

    private carregar(dados: IRegistro[]) {
        dados.map((reg, index) => {
            for (const key in reg) {
                let col = this._basecolunas.getColuna(key);
                let conj = this._baseconjuntos.getConjunto(reg[key], col.nome);
                conj.addId(index)
            }
            reg._id = index
            reg._filtro = true;
            reg._outlier = false;
            reg._obs = '';
            this._registros.push(reg)
        })
    }

    atualizarDatasets() {
        this._datasets = [];
        let cols = this._basecolunas.getInfo()
        if (!cols.metrica) return;

        let conjs = this._baseconjuntos.getConjuntos().filter(conj => {
            if (cols.grupo && (conj.coluna == cols.grupo)) return true
            if (!cols.grupo && (conj.coluna == cols.metrica)) return true
            return false
        })

        let ids_outliers = this.getOutliers(true);
        const fnFiltrar = this._baseconjuntos.getFuncaoFiltrar(ids_outliers);

        this._datasets = conjs.map(conj => {
            let ids = [...conj.ids].filter(fnFiltrar)
            return this.createDataset(
                [...conj.ids].filter(fnFiltrar),
                conj.nome, cols.metrica, cols.variavel, cols.visiveis
            )
        })

        if (ids_outliers.length > 0) {
            let outliers = this.createDataset(
                ids_outliers, "Outliers", cols.metrica, cols.variavel, cols.visiveis
            )
            this._datasets.push(outliers);
        }

    }

    createDataset(ids: number[], label: string, col_y: string, col_x: string, cols_info: string[]) {
        let ys = this.getValores(col_y, ids)
        let xs = col_x ? this.getValores(col_x, ids) : null;
        let data = ids.map((id, index) => {
            let point = {
                x: xs[index],
                y: ys[index],
                r: 3,
                d: { id: id }
            }
            for (const col of cols_info) point.d[col] = this._registros[id][col]
            return point
        })
        return { label, xs, ys, data }
    }

    getIdFromPonto(datasetindex: number, index: number): number {
        return this._datasets[datasetindex].data[index]['d']['id']
    }

    private calcularConjuntos(ids: number[] = null) {
        let info_colunas = this._basecolunas.getInfo();
        let outliers = this.getOutliers(true)
        this._baseconjuntos.calcularConjuntos(this, info_colunas, outliers);
        this.atualizarDatasets();
        this._basecolunas.calcularColunas(
            this._baseconjuntos.getConjuntos()
        )
    }

    getOutliers(somente_ids: boolean = false): any[] {
        let regs = this._registros.filter(r => r._outlier)
        if (somente_ids) return regs.map(r => r._id);

        const keys = this._basecolunas.getInfo().visiveis;

        return regs.map(reg => {
            let ol = { '_id': reg._id }
            for (const key of keys) ol[key] = reg[key]
            return ol
        })
    }

    toogleOutlier(id: number): IRegistro[] {
        this._registros[id]._outlier = !(this._registros[id]._outlier)
        this.calcularConjuntos([id]);
        return this.getOutliers();
    }

    toogleExibir(coluna:string){
        this._basecolunas.toogleExibir(coluna);
        this.atualizarDatasets();
    }

    setFiltro(f: IFiltro): IFiltro[] {
        this._baseconjuntos.setFiltro(f);
        this.calcularConjuntos();
        return this._baseconjuntos.getFiltros();
    }

}