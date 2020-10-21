import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { IInfoColunas } from './basecolunas.class';
import { IDataset } from './basedados.class';

export interface IGrafico {
	datasets: ChartDataSets[];
	options: ChartOptions;
	legend: boolean;
	chartType: ChartType;
	labels?: string[];
	colors?: any;

}

export class Grafico {

	static cores = ['red', 'green', 'blue', 'purple', 'yellow',
		'brown', 'magenta', 'cyan', 'orange', 'pink']

	static formatado(v:any){
		if (isNaN(+v)) return v;
		return v.toFixed(2).replace('.',',').replace(/\d(?=(\d{3})+\,)/g, '$&.');
	}


	static setTitulo(col:IInfoColunas){
		let titulo = '';
		if(col.metrica && col.variavel){
			titulo = col.metrica + " por " + col.variavel;
		} else {
			if(col.metrica) titulo = col.metrica;
			if(col.variavel) titulo = col.variavel;
		}
		return titulo;
	}

	static createBubbleChart(ds: IDataset[], col:IInfoColunas): IGrafico {
		return {
			legend: true,
			chartType: 'bubble',
			datasets: this.criarDatasetGrafBolha(ds),
			options: {
				animation: { duration: 0 },
				responsive: true,
				title: {
					display: true,
        			position: 'top', 
        			fullWidth: true,
			        text: Grafico.setTitulo(col),
				},
				maintainAspectRatio: false,
				legend: { position: 'bottom' },
				scales: { xAxes: [{}], yAxes: [{}] },
				tooltips: {
					displayColors: false,
					callbacks: {
						label: function (tooltipItem, data) {
							let info = <any>data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
							let texto = ["Informações", "-----------"]
							for (const key in info['d']) {
								texto.push(key + ": " + Grafico.formatado(info['d'][key]))
							}
							return texto
						}
					}
				}
			}
		};
	}

	static criarDatasetPontos(datasets: IDataset[]): ChartDataSets[] {
		return datasets.map((d, i) => {
			return {
				label: d.label,
				data: d.data,
				backgroundColor: (d.label != "Outliers") ? this.cores[i] : 'black',
				borderColor: 'white',
				hoverBackgroundColor: this.cores[i],
				hoverBorderColor: 'black'
			}
		})
	}

	static criarDatasetMedia(datasets: IDataset[]): ChartDataSets {
		let dados_media = datasets.reduce((ds, conj, index) => {
			if (conj.analise?.regressao) {
				let min_y = conj.analise.x.min * conj.analise.regressao.ax + conj.analise.regressao.b;
				let max_y = conj.analise.x.max * conj.analise.regressao.ax + conj.analise.regressao.b;
				ds.push({ x: conj.analise.x.min, y: min_y, d: conj.analise.regressao })
				ds.push({ x: conj.analise.x.max, y: max_y, d: conj.analise.regressao })
				return ds
			}
			if (conj.analise?.x) {
				ds.push({ x: 0, y: index + 0.7, d: { '_': '.' } })
				ds.push({ x: conj.analise.x.media, y: index + 0.7, d: conj.analise.x })
				ds.push({ x: conj.analise.x.media, y: index + 1.3, d: conj.analise.x })
				ds.push({ x: 0, y: index + 1.3, d: { '_': '..' } })
				return ds
			}
			if (conj.analise?.y) {
				ds.push({ y: 0, x: index + 0.7, d: { '_': '...' } })
				ds.push({ y: conj.analise.y.media, x: index + 0.7, d: conj.analise.y })
				ds.push({ y: conj.analise.y.media, x: index + 1.3, d: conj.analise.y })
				ds.push({ y: 0, x: index + 1.3, d: { '_': '....' } })
				return ds
			}
			return ds;
		}, []);

		return {
			label: "Média",
			data: dados_media,
			backgroundColor: 'rgba(0,0,0,0)',
			borderColor: 'grey',
			hoverBackgroundColor: 'black',
			hoverBorderColor: 'black',
			type: 'line',
			lineTension: 0,
			pointBackgroundColor: 'grey'
		}
	}

	static criarDatasetPad(datasets: IDataset[]): ChartDataSets[] {
		let dados_pad = datasets.reduce((ds, conj, index) => {
			if (conj.analise?.regressao) {
				let min_y = conj.analise.x.min * conj.analise.regressao.ax + conj.analise.regressao.b;
				let max_y = conj.analise.x.max * conj.analise.regressao.ax + conj.analise.regressao.b;
				ds.push({ x: conj.analise.x.min, y: min_y, d: conj.analise.regressao })
				ds.push({ x: conj.analise.x.max, y: max_y, d: conj.analise.regressao })
				return ds
			}
			if (conj.analise?.x) {
				ds.push({ x: 0, y: index + 0.7, d: { '_': '.' } })
				ds.push({ x: conj.analise.x.media + conj.analise.x.desviopadrao, y: index + 0.7, d: conj.analise.x })
				ds.push({ x: conj.analise.x.media + conj.analise.x.desviopadrao, y: index + 1.3, d: conj.analise.x })
				ds.push({ x: conj.analise.x.media - conj.analise.x.desviopadrao, y: index + 1.3, d: conj.analise.x })
				ds.push({ x: conj.analise.x.media - conj.analise.x.desviopadrao, y: index + 0.7, d: conj.analise.x })
				ds.push({ x: conj.analise.x.media - conj.analise.x.desviopadrao, y: index + 1.3, d: conj.analise.x })
				ds.push({ x: 0, y: index + 1.3, d: { '_': '..' } })
				return ds
			}
			if (conj.analise?.y) {
				ds.push({ y: 0, x: index + 0.7, d: { '_': '...' } })
				ds.push({ y: conj.analise.y.media + conj.analise.y.desviopadrao, x: index + 0.7, d: conj.analise.y })
				ds.push({ y: conj.analise.y.media + conj.analise.y.desviopadrao, x: index + 1.3, d: conj.analise.y })
				ds.push({ y: conj.analise.y.media - conj.analise.y.desviopadrao, x: index + 1.3, d: conj.analise.y })
				ds.push({ y: conj.analise.y.media - conj.analise.y.desviopadrao, x: index + 0.7, d: conj.analise.y })
				ds.push({ y: conj.analise.y.media - conj.analise.y.desviopadrao, x: index + 1.3, d: conj.analise.y })
				ds.push({ y: 0, x: index + 1.3, d: { '_': '....' } })
				return ds
			}
			return ds;
		}, []);

		return [{
			label: "Pad",
			data: dados_pad,
			backgroundColor: 'rgba(0,0,0,0)',
			borderColor: 'lightgrey',
			hoverBackgroundColor: 'black',
			hoverBorderColor: 'black',
			type: 'line',
			lineTension: 0,
			pointBackgroundColor: 'lightgrey'
		},
	]
	}

	static criarDatasetGrafBolha(datasets: IDataset[]): ChartDataSets[] {
		let pontos = Grafico.criarDatasetPontos(datasets);
		let pads = Grafico.criarDatasetPad(datasets);
		for(const p of pads) pontos.push(p);
		let media_ds = Grafico.criarDatasetMedia(datasets);
		pontos.push(media_ds);
		
		return pontos
	}

}