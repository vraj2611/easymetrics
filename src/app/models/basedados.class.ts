import { BaseConjuntos, IFiltro } from './baseconjuntos.class'
import { BaseColunas, IInfoColunas, Status } from './basecolunas.class'
import { Analise } from './analise.class';

export interface IRegistro {
    _id: number;
    _outlier: boolean;
    _filtro: boolean;
    _obs: string;
}

export interface INumero {
    id: number;
    coluna: number;
    valor: number;
}

export interface IDataset {
    label: string;
    xs: number[];
    ys: number[];
    data: any[];
    analise?: Analise
}

export class BaseDados {

    private _registros: IRegistro[]
    private _basecolunas: BaseColunas;
    private _baseconjuntos: BaseConjuntos;
    private _datasets: IDataset[];

    constructor(registros: any[]) {
        this._basecolunas = new BaseColunas();
        this._baseconjuntos = new BaseConjuntos();
        this._registros = [];
        this._datasets = [];
        this.carregar(registros);
        let conjs = this._baseconjuntos.getConjuntos();
        this._basecolunas.classificarColunas(conjs);
        this.analisarConjuntos();
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
        this.analisarConjuntos();
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
        if (!cols.metrica && !cols.variavel) return;

        let conjs = this._baseconjuntos.getConjuntos().filter(conj => {
            if (cols.grupo && (conj.coluna == cols.grupo)) return true
            if (!cols.grupo && (conj.coluna == cols.metrica)) return true
            if (!cols.grupo && (conj.coluna == cols.variavel)) return true
            return false
        })

        let ids_outliers = this.getOutliers(true);
        const fnFiltrar = this._baseconjuntos.getFuncaoFiltrar(ids_outliers);
        
        let analise_coluna = null;
        if (cols.metrica && cols.variavel) {
            for (const conj of conjs) {
                if(conj.coluna == cols.metrica) analise_coluna = conj.analise
            }
        }

        this._datasets = conjs.map((conj, i) => {
            let grp = (cols.metrica && cols.variavel) ? null : i + 1;
            let analise_conj = analise_coluna || conj.analise 
            return this.criarDataset(
                [...conj.ids].filter(fnFiltrar), conj.nome, cols, grp, analise_conj
            )
        })

        if (ids_outliers.length > 0) {
            let grp = (cols.metrica && cols.variavel) ? null : this._datasets.length + 1
            let outliers = this.criarDataset(ids_outliers, "Outliers", cols, grp, null)
            this._datasets.push(outliers);
        }



    }

    criarDataset(ids: number[], label: string, col: IInfoColunas, grupo_index: number = null, analise: Analise = null) {
        let ys = (col.metrica)
            ? this.getValores(col.metrica, ids)
            : ids.map(i => (-0.5 + Math.random()) * 0.3 + grupo_index)

        let xs = (col.variavel)
            ? this.getValores(col.variavel, ids)
            : ids.map(i => (-0.5 + Math.random()) * 0.3 + grupo_index)

        let data = ids.map((id, index) => {
            let point = {
                x: xs[index],
                y: ys[index],
                r: 3,
                d: { id: id }
            }
            for (const c of col.visiveis) point.d[c] = this._registros[id][c]
            return point
        })
        return { label, xs, ys, data, analise }
    }

    getIdFromPonto(datasetindex: number, index: number): number {
        return this._datasets[datasetindex].data[index]['d']['id']
    }

    private analisarConjuntos(ids: number[] = null) {
        let info_colunas = this._basecolunas.getInfo();
        let outliers = this.getOutliers(true)
        this._baseconjuntos.analisarConjuntos(this, info_colunas, outliers);
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
        this.analisarConjuntos([id]);
        return this.getOutliers();
    }

    toogleExibir(coluna: string) {
        this._basecolunas.toogleExibir(coluna);
        this.atualizarDatasets();
    }

    setFiltro(f: IFiltro): IFiltro[] {
        this._baseconjuntos.setFiltro(f);
        this.analisarConjuntos();
        return this._baseconjuntos.getFiltros();
    }

    getInfoColunas(){
        return this._basecolunas.getInfo();
    }
}