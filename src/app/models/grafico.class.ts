import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
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

    static createBubbleChart(ds: IDataset[]):IGrafico {
        return {
            legend: true,
            chartType: 'bubble',
            datasets: this.criarDatasetGrafBolha(ds),
            options: {
                animation: { duration: 0 },
                responsive: true,
                maintainAspectRatio: false,
                legend: { position: 'bottom' },
                scales: { xAxes: [{}], yAxes: [{}] },
                tooltips: {
                    displayColors: false,
                    callbacks: {
                        label: function (tooltipItem, data) {
                            let info = <any>data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
                            let texto = ["== Info =="]
                            for (const key in info['d']){
                                texto.push(key + ": " + info['d'][key])
                            }
                            return texto
                        }
                    }
                }
            }
        };
    }

	static criarDatasetGrafBolha(datasets: IDataset[]):ChartDataSets[] {
        return datasets.map((d, i) => {
            return  {
                label: d.label,
                data: d.data,
                backgroundColor: (d.label != "Outliers") ? this.cores[i]: 'black',
                borderColor: 'white',
                hoverBackgroundColor: this.cores[i],
                hoverBorderColor: 'black'
            }
        })
    }


	setDataSets(refs: any[], estatistica: any): void {
		let xx = [
			{
				data: [],
				label: 'Inclusos',
				backgroundColor: 'green',
				borderColor: 'blue',
				hoverBackgroundColor: 'purple',
				hoverBorderColor: 'red'
			},
			{
				data: [
					{ x: estatistica.min, y: estatistica.media },
					{ x: estatistica.max, y: estatistica.media },
				],
				label: 'Media',
				backgroundColor: 'rgba(0,0,0,0)',
				borderColor: 'black',
				hoverBackgroundColor: 'purple',
				hoverBorderColor: 'red',
				type: 'line'
			},
			{
				data: [
					{ x: estatistica.min, y: estatistica.media + estatistica.desviopadrao },
					{ x: estatistica.max, y: estatistica.media + estatistica.desviopadrao },
				],
				label: '+DesvPad',
				backgroundColor: 'rgba(0,0,0,0)',
				borderColor: 'grey',
				hoverBackgroundColor: 'purple',
				hoverBorderColor: 'red',
				type: 'line'
			},
			{
				data: [
					{ x: estatistica.max, y: estatistica.media - estatistica.desviopadrao },
					{ x: estatistica.min, y: estatistica.media - estatistica.desviopadrao },
				],
				label: '-DesvPad',
				backgroundColor: 'rgba(0,0,0,0)',
				borderColor: 'grey',
				hoverBackgroundColor: 'purple',
				hoverBorderColor: 'red',
				type: 'line'
			}
		];
	}
}