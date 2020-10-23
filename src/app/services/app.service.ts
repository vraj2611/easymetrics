import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BaseDados, IRegistro } from '../models/basedados.class';
import { Coluna, Status } from '../models/basecolunas.class';
import { Conjunto, IFiltro } from '../models/baseconjuntos.class';
import { Grafico, IGrafico } from '../models/grafico.class';

@Injectable({
	providedIn: 'root'
})
export class AppService {
	private _base: BaseDados;
	private _colunaSelecionada: string;
	private _colunas = new BehaviorSubject<Coluna[]>(null);
	private _conjuntos = new BehaviorSubject<Conjunto[]>(null);
	private _filtros = new BehaviorSubject<IFiltro[]>(null);
	private _outliers = new BehaviorSubject<IRegistro[]>(null);
	private _grafico = new BehaviorSubject<IGrafico>(null);
	private _subgrafconj = new BehaviorSubject<IGrafico>(null);

	constructor() { }

	getRelatorio() {
		return {
			dados: this._base.getRegistros(),
			colunas: this._base.getColunas(),
			grupos: this._base.getConjuntos()
		}
	}

	colunas$() {
		return this._colunas.asObservable();
	}

	getColunas() {
		return this._base.getColunas();
	}

	conjuntos$() {
		return this._conjuntos.asObservable();
	}

	getConjuntos(coluna: string = null) {
		return this._base.getConjuntos(coluna);
	}

	filtros$() {
		return this._filtros.asObservable();
	}

	outliers$() {
		return this._outliers.asObservable();
	}

	grafico$() {
		return this._grafico.asObservable();
	}

	subGraficoConjunto$() {
		return this._subgrafconj.asObservable();
	}

	getColunaSelecionada() {
		return this._colunaSelecionada;
	}

	carregar(dados: any[]): number {
		this._base = new BaseDados(dados);
		let colunas = this._base.getColunas()
		this._colunas.next(colunas);
		return this._base.getRegistros().length
	}

	selecionarColuna(coluna: string) {
		this._colunaSelecionada = coluna;
		this._conjuntos.next(this._base.getConjuntos(coluna))
	}

	setStatus(nome_coluna: string, status: Status) {
		this._base.setStatus(nome_coluna, status);
		this.atualizarGrafico();
	}

	setFiltro(filtro: IFiltro) {
		let filtros = this._base.setFiltro(filtro);
		this._filtros.next(filtros);
		this.atualizarGrafico();
	}

	toogleOutlier(id: number) {
		let outliers = this._base.toogleOutlier(id);
		this._outliers.next(outliers);
		this.atualizarGrafico();
	}

	clickPontoGrafico(datasetindex: number, index: number) {
		let id = this._base.getIdFromPonto(datasetindex, index);
		this.toogleOutlier(id);
	}

	toogleExibir(coluna: string) {
		this._base.toogleExibir(coluna);
		let outliers = this._base.getOutliers();
		this._outliers.next(outliers);
		this.atualizarGrafico();
	}

	atualizarGrafico() {
		this._colunas.next(this._base.getColunas());
		this._conjuntos.next(this._base.getConjuntos(this._colunaSelecionada));
		let ds = this._base.getDatasets();
		let col = this._base.getInfoColunas();
		let global = (col?.metrica) ? this._base.getConjuntos(col.metrica)[0] : null;
		if (ds.length > 0) {
			let graf = Grafico.createBubbleChart(ds, col, global);
			this._grafico.next(graf)
		}
	}
}

