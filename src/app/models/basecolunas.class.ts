import { Conjunto } from './baseconjuntos.class';

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
        this.exibir = false;
    }
}

export class BaseColunas {
    private _colunas: Coluna[];

    constructor(){
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

    getInfo():IInfoColunas{
        return this._colunas.reduce((info, c)=>{
            if(c.status == Status.GRUPO) info.grupo = c.nome
            if(c.status == Status.METRICA) info.metrica = c.nome
            if(c.status == Status.VARIAVEL) info.variavel = c.nome
            if(c.exibir) info.visiveis.push(c.nome)
            if(c.tipo == "String") info.strings.push(c.nome)
            if(c.tipo == "Numero") info.numeros.push(c.nome)
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

    toogleExibir(nome_coluna: string){
        for (const c of this._colunas) {
            if (c.nome == nome_coluna) c.exibir = !c.exibir
        }
    }

    classificarColunas(conjuntos:Conjunto[]){
        for (const coluna of this._colunas) {
            let conjs_col = conjuntos.filter(c => c.coluna == coluna.nome);
            let nums = conjs_col.filter(g => g.nome == '_numeros')
            if (nums.length > 0) coluna.tipo = 'Numero';
            let strs = conjs_col.filter(g => g.nome != '_numeros')
            if (strs.length > 0) coluna.tipo = 'String';    
        }
    }

    calcularColunas(conjuntos:Conjunto[]) {
        for (const c of this._colunas) {
            c.maiorqtde = 0;
            c.menorqtde = 999;
            c.maiorvar = 0;
            c.menorvar = 999;
            let gcol = conjuntos.filter(g => g.coluna == c.nome)
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

}