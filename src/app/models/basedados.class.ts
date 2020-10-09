import { Analise } from './analise.class'
import { Coluna, Status } from './coluna.class'
import { Grupo } from './grupo.class'

export interface IRegistro {
    _id: number;
    _outlier: boolean;
    _filtro: boolean;
    _obs: string;
}

export interface IFiltro {
    grupo: string;
    coluna: string;
    filtro: number;
}

export class BaseDados {

    private _registros: IRegistro[]
    private _colunas: Coluna[]
    private _grupos: Grupo[]

    constructor(dados: any[]) {
        this._colunas = [];
        this._grupos = [];
        this._registros = [];
        this.carregar(dados);
        for (const c of this._colunas) {
            c.tipo = this.definirTipoColuna(c.nome)
        }
        this.calcularGrupos();
    }

    getColunas() {
        return this._colunas.slice();
    }

    getGrupos(coluna:string = null) {
        if(!coluna) return this._grupos.slice();
        return this._grupos.filter(g=> g.coluna == coluna);
    }

    getRegistros(){
        return this._registros.slice();
    }

    combinarColunas(coluna1:string, coluna2:string){

    }

    segmentarNumeros(coluna:string, limites_sup:number[]){

    }

    setStatus(nome_coluna: string, status: Status) {
        for (const c of this._colunas) {
            if (c.status == status) c.status = Status.NULO
            if (c.nome == nome_coluna) c.status = status
        }
        this.calcularGrupos();
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
        let grupos_col = this._grupos.filter(g => g.coluna == coluna);
        let nums = grupos_col.filter(g => g.nome == '_numeros')
        if (nums.length > 0) return 'Numero';
        let strs = grupos_col.filter(g => g.nome != '_numeros')
        if (strs.length > 0) return 'String';
    }

    private getGrupo(nome: string, coluna: string): Grupo {
        let id_grupo = ''
        if (nome.length == 0) {
            id_grupo = '_vazios'
        } else {
            id_grupo = isNaN(+nome) ? nome : '_numeros'
        }
        let grupo = this._grupos.find(g => {
            if (g.coluna != coluna) return false
            if (g.nome != id_grupo) return false
            return true
        })
        if (grupo) return grupo
        grupo = new Grupo(id_grupo, coluna);
        this._grupos.push(grupo)
        return grupo
    }

    private carregar(dados: IRegistro[]) {
        dados.map((reg, index) => {
            for (const key in reg) {
                let col = this.getColuna(key);
                let grupo = this.getGrupo(reg[key], col.nome)
                grupo.addId(index)
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
            let gcol = this._grupos.filter(g => g.coluna == c.nome)
            gcol.map(g => {
                let q = g.ids.size;
                c.maiorqtde = (q > c.maiorqtde) ? q : c.maiorqtde;
                c.menorqtde = (q < c.menorqtde) ? q : c.menorqtde;
                if (q > 1 && g.analise) {
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

    private calcularGrupos(ids: number[] = null) {
        let c_metr = this._colunas.find(c => c.status == Status.METRICA);
        let c_var = this._colunas.find(c => c.status == Status.VARIAVEL);
        const fnFiltrar = this.getFuncaoFiltrar();
        for (const g of this._grupos) {
            let ids = [...g.ids].filter(fnFiltrar)
            if (c_metr) {
                let ys = this.getValores(c_metr.nome, ids)
                let xs = c_var ? this.getValores(c_var.nome, ids) : null;
                g.analise = new Analise(ys, xs);
            } else if (g.nome == '_numeros') {
                let ys = this.getValores(g.coluna, ids)
                g.analise = new Analise(ys, null);
            }
        }
        this.calcularColunas();
    }

    toogleOutlier(id: number) {
        for (const reg of this._registros) {
            if (reg._id == id) reg._outlier = !reg._outlier
		}
        this.calcularGrupos([id]);
    }

    setFiltro(f:IFiltro):IFiltro[]{
        for (const g of this._grupos) {
            if (f.grupo == g.nome && f.coluna == g.coluna) g.filtro = f.filtro
        }
        this.calcularGrupos();
        return this.getFiltros();
    }

    getFiltros():IFiltro[]{
        const filtrados = this._grupos.filter(g=>g.filtro != 0)
        return filtrados.map(f=>{
            return {
                grupo: f.nome,
                coluna: f.coluna,
                filtro: f.filtro
            }
        })
    }

    getFuncaoFiltrar(){
        let incluir = new Set<number>();
        let outliers = this._registros.filter(r=>r._outlier).map(r=>r._id);
        let excluir = new Set<number>(outliers);
        for( const g of this._grupos){
            if (g.filtro > 0) for (const id of g.ids) incluir.add(id)
            if (g.filtro < 0) for (const id of g.ids) excluir.add(id)
        }
        console.log("incluir", Array.from(incluir))
        console.log("excluir", Array.from(excluir))
        if (incluir.size > 0 && excluir.size > 0){
            return function(id:number) { return incluir.has(id) && !excluir.has(id) }
        } else if (incluir.size > 0){
            return function(id:number) { return incluir.has(id)}
        } else if (excluir.size > 0){
            return function(id:number) { return !excluir.has(id)}
        }
        return function(id:number) { return true}
    }

}