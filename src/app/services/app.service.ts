import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BaseDados, IFiltro } from '../models/basedados.class';
import { Coluna, Status } from '../models/coluna.class';
import { Conjunto } from '../models/conjunto.class';
import { GraficoService } from './grafico.service';


@Injectable({
	providedIn: 'root'
})
export class AppService {
	private _colunas = new BehaviorSubject<Coluna[]>(null);
	private _conjuntos = new BehaviorSubject<Conjunto[]>(null);
	private _base: BaseDados;
	private _colunaSelecionada: string;
	private _filtros = new BehaviorSubject<IFiltro[]>(null);

	constructor(private grafServ:GraficoService) {}

	getRelatorio(){
		return {
			dados: this._base.getRegistros(),
			colunas: this._base.getColunas(),
			grupos: this._base.getConjuntos()
		}
	}

	colunas$() {
		return this._colunas.asObservable();
	}

	getColunas(){
		return this._base.getColunas();
	}

	conjuntos$() {
		return this._conjuntos.asObservable();
	}

	getConjuntos(coluna:string = null){
		return this._base.getConjuntos(coluna);
	}

	filtros$(){
		return this._filtros.asObservable();
	}

	getColunaSelecionada(){
		return this._colunaSelecionada;
	}

	carregar(dados: any[]) {
		this._base = new BaseDados(dados);
		let colunas = this._base.getColunas()
		this._colunas.next(colunas);
		this.grafServ.plotEspalhamentoColunas();	
	}

	selecionarColuna(coluna:string){
		this._colunaSelecionada = coluna;
		this._conjuntos.next(this._base.getConjuntos(coluna))
	}

	setStatus(nome_coluna: string, status: Status) {
		console.log(nome_coluna, status);
		this._base.setStatus(nome_coluna, status);
		let colunas = this._base.getColunas();
		this._colunas.next(colunas);
		let ds = this._base.getDatasets();
		if(ds.length > 0){
			console.log(ds)
			this.grafServ.plotDados(ds);
		}	
	}

	setFiltro(filtro: IFiltro){
		let filtros = this._base.setFiltro(filtro);
		this._filtros.next(filtros);
		let ds = this._base.getDatasets();
		if(ds.length > 0){
			console.log(ds)
			this.grafServ.plotDados(ds);
		}
	}
	// plotarEspalhamentoColuna(){
	
	// }

	// plotarGrafico(col_x, col_y, col_cor = null, grupo_filtro = null) {
	// 	let ys = this.getValoresColunas(col_y)
	// 	let xs = this.getValoresColunas(col_x)
	// 	let analise = this.aServ.getAnalise(ys, xs)
	// 	let estatistica = {
	// 		min: analise.x.min,
	// 		max: analise.x.max,
	// 		media: analise.y.media,
	// 		desviopadrao: analise.y.desviopadrao
	// 	}
	// 	let tam = 2
	// 	let itens = xs.map((x, index) => {
	// 		return {
	// 			x: x,
	// 			y: ys[index],
	// 			t: tam,
	// 			tag: 'tag' + x,
	// 			id: index
	// 		}
	// 	})
	
	// }

	// toogleOutlier(id: number) {
	// 	let novo = this._dados.value.map(reg => {
	// 		if (reg._id != id) return reg
	// 		reg._outlier = !reg._outlier
	// 		return reg
	// 	})
	// 	this._dados.next(novo);
	// 	this.calcularGrupos([id]);
	// }


}

