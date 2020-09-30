import { Injectable } from '@angular/core';
import * as ss from 'simple-statistics';

export interface IAnalise {
	y?: {
		distintos: number;
		media: number;
		coef_var: number;
		min: number;
		max: number;
	};
	x?: {
		distintos: number;
		media: number;
		coef_var: number;
		min: number;
		max: number;
	};
	regressao?: {
		ax: number;
		b: number;
		r2: number;
		rmse: number;
	}

}

@Injectable({
	providedIn: 'root'
})
export class AnaliseService {

	getAnalise(valores_y: number[], valores_x: number[] = null): IAnalise {
		let med_y = ss.average(valores_y)
		let res: IAnalise = {
			y: {
				distintos: new Set(valores_y).size,
				media: med_y,
				min: ss.min(valores_y),
				max: ss.max(valores_y),
				coef_var: ss.standardDeviation(valores_y) / med_y
			}
		}
		if (valores_x) {
			res.x.distintos = new Set(valores_x).size;
			res.x.media = ss.average(valores_x);
			res.x.min = ss.min(valores_x);
			res.x.max = ss.max(valores_x);
			res.x.coef_var = ss.standardDeviation(valores_x) / res.x.media;

			let pairs = valores_x.map((x, i) => [x, valores_y[i]])
			let lr = ss.linearRegression(pairs);
			res.regressao.ax = lr.m;
			res.regressao.b = lr.b;
			res.regressao.r2 = ss.rSquared(pairs, ss.linearRegressionLine(lr))
		}
		return res
	}
}

