import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class GraficoService {
	private _grafico = new BehaviorSubject<any>(null);

	constructor(){

	}

	grafico$() {
		return this._grafico.asObservable()
	}

}