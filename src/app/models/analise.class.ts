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
        if (valores_y.length < 2) return
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

    static getHistograma(valores: number[], n_classes: number = 10) {
        let min = ss.min(valores);
        let max = ss.max(valores);
        let larg = (max - min) / n_classes;
        let classes = [];
        for (let i = 0; i < n_classes; i++) {
            let inf = (min + (larg * i)).toFixed(0);
            let sup = (min + (larg * (i+1))).toFixed(0);
            classes.push({
                label: inf + "~" + sup,
                qtde: 0
            })
        }
        let hist = valores.reduce((classes, v)=>{
            let c = Math.round(v / larg)
            classes[c]['qtde'] += 1
            return classes
        })

        return hist;

    }
}