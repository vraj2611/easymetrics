import * as ss from 'simple-statistics';

interface IDispersao {
    distintos: number;
    media: number;
    desviopadrao: number;
    coef_var: number;
    min: number;
    max: number;
};

export class Analise {
    y?: IDispersao
    x?: IDispersao
    regressao?: {
        ax: number;
        b: number;
        r2: number;
        rmse: number;
    }

    constructor(valores_y: number[], valores_x: number[] = null) {
        if(valores_y.length < 2) return 
        this.y = this.calcularDispersao(valores_y);
        if (valores_x) {
            this.x = this.calcularDispersao(valores_x);
            this.regressao = this.calcularRegressao(valores_x, valores_y);
        }
    }

    calcularDispersao(valores: number[]): IDispersao {
        let med = ss.average(valores);
        let std = ss.standardDeviation(valores);
        return {
            distintos: new Set(valores).size,
            media: med,
            desviopadrao: std,
            min: ss.min(valores),
            max: ss.max(valores),
            coef_var: std / med
        }
    }

    calcularRegressao(xs: number[], ys: number[]) {
        let pairs = xs.map((x, i) => [x, ys[i]])
        let lr = ss.linearRegression(pairs);
        return {
            ax: lr.m,
            b: lr.b,
            r2: ss.rSquared(pairs, ss.linearRegressionLine(lr)),
            rmse: 0
        }

    }
}