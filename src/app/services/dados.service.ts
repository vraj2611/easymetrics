import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Coluna, IRegistro, Status } from '../models/coluna.class';
import { Grupo } from '../models/grupo.class';
import { AnaliseService } from './analise.service';

@Injectable({
	providedIn: 'root'
})
export class DadosService {
	private _dados = new BehaviorSubject<IRegistro[]>([]);
	private _colunas_sub = new BehaviorSubject<Coluna[]>([]);
	private _grupos_sub = new BehaviorSubject<Grupo[]>([]);
	private _colunas: Coluna[] = [];
	private _grupos: Grupo[] = [];

	constructor(private aServ: AnaliseService) {

	}

	dados$() {
		return this._dados.asObservable()
	}

	colunas$() {
		return this._colunas_sub.asObservable()
	}

	grupos$() {
		return this._grupos_sub.asObservable()
	}

	private getColuna(nome: string): Coluna {
		let col = this._colunas.find(c => c.nome == nome);
		if (col) return col
		col = new Coluna(nome);
		this._colunas.push(col)
		return col;
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

	carregar(dados: IRegistro[]) {
		let tratados = dados.map((reg, index) => {
			for (const key in reg) {
				let col = this.getColuna(key);
				let grupo = this.getGrupo(reg[key], col.nome)
				grupo.addId(index)
			}
			reg._id = index
			reg._filtro = true;
			reg._outlier = false;
			reg._obs = '';
			return reg
		})
		this._dados.next(tratados);
		this._colunas.forEach(c => c.tipo = this.definirTipoColuna(c.nome))
		this._colunas_sub.next(this._colunas);
		this.calcularGrupos();
	}

	calcularGrupos(ids: number[] = null) {
		let c_metr = this._colunas.find(c => c.status == Status.METRICA);
		let c_var = this._colunas.find(c => c.status == Status.VARIAVEL);
		this._grupos = this._grupos.map(g => {
			//if (ids && ids.every(id => !g.ids.has(id))) return g
			if (c_metr) {
				let ys = this.getValoresColunas(c_metr.nome, [...g.ids])
				let xs = c_var ? this.getValoresColunas(c_var.nome, [...g.ids]) : null;
				g.analise = this.aServ.getAnalise(ys, xs);
			} else if (g.nome == '_numeros') {
				let ys = this.getValoresColunas(g.coluna, [...g.ids])
				g.analise = this.aServ.getAnalise(ys, null);
			}
			return g;
		})

		this._grupos_sub.next(this._grupos);
	}

	getValoresColunas(coluna: string, ids: number[]) {
		let regs = this._dados.value.filter(v => ids.includes(v._id));
		return regs.map(r => r[coluna]);
	}

	setStatus(nome_coluna: string, status: Status) {
		this._colunas = this._colunas.map(c => {
			if (c.status == status) c.status = Status.NULO
			if (c.nome == nome_coluna) c.status = status
			return c
		});
		this._colunas_sub.next(this._colunas);
		this.calcularGrupos();
	}

	toogleOutlier(id: number) {
		let novo = this._dados.value.map(reg => {
			if (reg._id != id) return reg
			reg._outlier = !reg._outlier
			return reg
		})
		this._dados.next(novo);
		this.calcularGrupos([id]);
	}

	definirTipoColuna(coluna: string): string {
		let grupos_col = this._grupos.filter(g => g.coluna == coluna);
		let nums = grupos_col.filter(g => g.nome == '_numeros')
		if (nums.length > 0) return 'Numero';
		let strs = grupos_col.filter(g => g.nome != '_numeros')
		if (strs.length > 0) return 'String';
	}


}

