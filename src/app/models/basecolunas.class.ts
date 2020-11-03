import { Conjunto } from './baseconjuntos.class';
import { BaseDados } from './basedados.class';

export interface IInfoColunas {
    metrica: string,
    variavel: string,
    grupo: string,
    visiveis: string[],
    numeros: string[],
    strings: string[]
}

export enum Status {
    VARIAVEL = "Variavel",
    METRICA = "Metrica",
    GRUPO = "Grupo",
    NULO = ""
}

export enum TipoColuna {
    STRING = 'String',
    NUMERO = 'Numero'
}

export class Coluna {
    nome: string;
    exibir: boolean;
    tipo: string;
    status: Status;
    distintos: number;
    menorvar: number;
    maiorvar: number;
    menorqtde: number;
    maiorqtde: number;
    desvpad_global: number;
    rmse_maior: number;
    ordem_indicacao: number;

    constructor(nome: string) {
        this.nome = nome;
        this.status = Status.NULO;
        this.menorvar = 0;
        this.maiorvar = 0;
        this.menorqtde = 0;
        this.maiorqtde = 0;
        this.exibir = false;
        this.desvpad_global = 0;
        this.rmse_maior = 0;
        this.ordem_indicacao = 0;
        this.distintos = 0;
    }
}

export class BaseColunas {
    private _colunas: Coluna[];

    constructor() {
        this._colunas = []
    }

    getColunas() {
        return this._colunas.slice();
    }

    getColuna(nome: string): Coluna {
        let col = this._colunas.find(c => c.nome == nome);
        if (col) return col
        col = new Coluna(nome);
        this._colunas.push(col)
        return col;
    }

    getInfo(): IInfoColunas {
        return this._colunas.reduce((info, c) => {
            if (c.status == Status.GRUPO) info.grupo = c.nome
            if (c.status == Status.METRICA) info.metrica = c.nome
            if (c.status == Status.VARIAVEL) info.variavel = c.nome
            if (c.exibir) info.visiveis.push(c.nome)
            if (c.tipo == "String") info.strings.push(c.nome)
            if (c.tipo == "Numero") info.numeros.push(c.nome)
            return info
        }, {
            metrica: null,
            variavel: null,
            grupo: null,
            visiveis: [],
            numeros: [],
            strings: []
        })
    }

    setStatus(nome_coluna: string, status: Status) {
        for (const c of this._colunas) {
            if (c.nome == nome_coluna) {
                c.status = (c.status == status) ? Status.NULO : status
                c.exibir = true
            } else {
                if (c.status == status) c.status = Status.NULO
            }
        }
    }

    toogleExibir(nome_coluna: string) {
        for (const c of this._colunas) {
            if (c.nome == nome_coluna) c.exibir = !c.exibir
        }
    }

    classificarColunas(conjuntos: Conjunto[]) {
        for (const coluna of this._colunas) {
            let conjs_col = conjuntos.filter(c => c.coluna == coluna.nome);
            let nums = conjs_col.filter(g => g.nome == '_numeros')
            if (nums.length > 0) coluna.tipo = 'Numero';
            let strs = conjs_col.filter(g => g.nome != '_numeros')
            if (strs.length > 0) coluna.tipo = 'String';
        }
    }


    definirOrdemIndicacao(){
        let dp_x_dist = this._colunas.reduce((values, c)=>{
            if (c.tipo == 'Numero') return values
            let value = c.distintos * c.desvpad_global
            if(value == 0) return values
            values.push({
                k:c.nome,
                v: Math.round(value / 1000000)
            })
            return values
        },[])

        let ordenados = dp_x_dist.sort((a,b)=> a.v - b.v)
        console.log(ordenados);
        for (const c of this._colunas) {
            c.ordem_indicacao = ordenados.findIndex(o=> o.k == c.nome) + 1
            
        }
    }

    calcularRMSEglobal(base: BaseDados) {
        let cols = this.getInfo();
        let fnFiltrar = base.getFuncaoFiltrar();

        for (const c of this._colunas) {
            let squared_errors = [];
            base.getConjuntos(c.nome).map(conj => {
                if (conj.analise?.regressao) {
                    let rl = conj.analise.regressao;
                    let ids = [...conj.ids].filter(fnFiltrar)
                    let xs = base.getValores(cols.variavel, ids)
                    let ys = base.getValores(cols.metrica, ids)
                    for (let i = 0; i < xs.length; i++) {
                        let sqr_error = (ys[i] - (rl.ax * xs[i] + rl.b)) ** 2
                        squared_errors.push(sqr_error)
                    }
                }
            });
            let qtde = squared_errors.length;
            if (qtde > 0) {
                let mean_squared_erros = squared_errors.reduce((soma, i) => {
                    soma += i / qtde;
                    return soma;
                }, 0)
                c.desvpad_global = mean_squared_erros ** 0.5
            }

        }
    }

    calcularColunas(base: BaseDados) {

        this.calcularRMSEglobal(base);
        for (const c of this._colunas) {
            c.maiorqtde = 0;
            c.menorqtde = 999;
            c.maiorvar = 0;
            c.menorvar = 999;
            let gcol = base.getConjuntos(c.nome).map(conj => {
                let size = conj.ids.size;
                c.maiorqtde = (size > c.maiorqtde) ? size : c.maiorqtde;
                c.menorqtde = (size < c.menorqtde) ? size : c.menorqtde;
                if ((size > 1) && conj.analise?.y?.coef_var) {
                    let v = Math.round(100 * conj.analise.y.coef_var);
                    if (v > 0) {
                        c.maiorvar = (v > c.maiorvar) ? v : c.maiorvar;
                        c.menorvar = (v < c.menorvar) ? v : c.menorvar;
                    }
                }
            })
            c.distintos = gcol.length;
        }
        this.definirOrdemIndicacao();
    }

}