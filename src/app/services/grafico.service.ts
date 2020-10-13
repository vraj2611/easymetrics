import { Injectable } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color } from 'ng2-charts';
import { BehaviorSubject, Observable } from 'rxjs';
import { IGrafico } from '../models/grafico.class';
import { Conjunto } from '../models/conjunto.class';
import { IDataset } from '../models/basedados.class';

@Injectable({
    providedIn: 'root'
})
export class GraficoService {

    private _grafico = new BehaviorSubject<IGrafico>(null)
    public ChartLegend = true;
    public ChartType = 'bubble';
    private _dataSets: ChartDataSets[] = null;
    public ChartOptions: ChartOptions = {
        animation: { duration: 0 },
        responsive: true
    };

    grafico$() {
        return this._grafico.asObservable();
    }

    handleChartClick(event) {

    }

    public plotDados(ds: IDataset[]) {
        let graf = {
            legend: true,
            chartType: 'bubble',
            options: {
                animation: { duration: 0 },
                responsive: true,
                maintainAspectRatio: false,
                legend: { position: 'bottom' },
                scales: { xAxes: [{}], yAxes: [{}] },
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem, data) {
                            let info = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
                            return JSON.parse(info['d'])['tag'];
                        }
                    }
                }
            },
            datasets: this.criarDatasetGrafBolha(ds)
            // datasets: [
            //     {
            //         data: [
            //             { x: 10, y: 10, r: 10 },
            //             { x: 15, y: 5, r: 15 },
            //             { x: 26, y: 12, r: 23 },
            //             { x: 7, y: 8, r: 8 },
            //         ],
            //         label: 'Series A',
            //         backgroundColor: 'green',
            //         borderColor: 'blue',
            //         hoverBackgroundColor: 'purple',
            //         hoverBorderColor: 'red',
            //     },
            // ]
        };

        this._grafico.next(<IGrafico>graf)
    }

    private criarDatasetGrafBolha(datasets: IDataset[]) {
        return datasets.map((d, i) => {
            let tratado = {
                label: d.label,
                data: [],
                backgroundColor: this.getColor(i),
                borderColor: this.getColor(i),
                hoverBackgroundColor: this.getColor(i),
                hoverBorderColor: 'black'
            }
            tratado.data = d.ys.map((y, i) => {
                return { x: d.xs[i], y: y, r: 2 }
            })
            return tratado
        })
    }

    public plotEspalhamentoColunas() {

        let graf: IGrafico = {
            legend: true,
            chartType: 'bar',
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            options: {
                title: { display: true, text: 'Chart.js Bar Chart - Stacked' },
                tooltips: { mode: 'index', intersect: false },
                responsive: true,
                scales: {
                    xAxes: [{ stacked: true, }],
                    yAxes: [{ stacked: true }]
                }
            },
            datasets: [
                { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
                { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
            ]
        }

        this._grafico.next(graf)
    }

    private prepareDataForEspalhamento(grupos: Conjunto[]): { labels: string[], datasets: any[] } {
        let labels = [];
        let datasets = [];
        for (const g of grupos) {
            if (!labels.includes(g.coluna)) labels.push(g.coluna)
            let i = labels.findIndex(l => l == g.coluna)
        }
        return { labels, datasets }
    }

    public plotDispersaoMetrica(pontos: any[], estatitica: {}) {

    }

    setToolTipLabel(tooltipItem, data) {
        let info = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
        return JSON.parse(info['d'])['tag'];
    }

    private getColor(id: number) {
        let cores = [
            'red',
            'green',
            'blue',
            'purple',
            'yellow',
            'brown',
            'magenta',
            'cyan',
            'orange',
            'pink'
        ]

        return cores[id]
    }

    setChartOptions(min: number, max: number): ChartOptions {
        return {
            animation: { duration: 0 },
            responsive: true,
            maintainAspectRatio: false,
            legend: { position: 'bottom' },
            scales: { xAxes: [{}], yAxes: [{}] },
            tooltips: {
                callbacks: {
                    label: this.setToolTipLabel
                }
            }
        }
    };

    public bubbleChartColors: Color[] = [
        {
            backgroundColor: [
                'red',
                'green',
                'blue',
                'purple',
                'yellow',
                'brown',
                'magenta',
                'cyan',
                'orange',
                'pink'
            ]
        }
    ];

    converterDados(refs: any[]) {
        return refs.map((r, i) => {
            return {
                x: r.x,
                y: r.y,
                r: 8,
                t: r.t,
                d: JSON.stringify({
                    'id': r.id,
                    'tag': r.tag,
                    'status': r.status
                })
            }
        });
    }

    getChartPoint(datasetIndex: number, pointIndex: number) {
        return this._dataSets[datasetIndex].data[pointIndex];
    }

    getDataSets(refs: any[], estatistica: any): ChartDataSets[] {
        this.setDataSets(refs, estatistica);
        return this._dataSets;
    }

    setDataSets(refs: any[], estatistica: any): void {
        this.setChartOptions(estatistica.min, estatistica.max);
        this._dataSets = [
            {
                data: this.converterDados(refs),
                label: 'Inclusos',
                backgroundColor: 'green',
                borderColor: 'blue',
                hoverBackgroundColor: 'purple',
                hoverBorderColor: 'red'
            },
            // {
            //   data: this.converterDados(refs.filter(r => r.status == "excluido")),
            //   label: 'Excluidos',
            //   backgroundColor: 'red',
            //   borderColor: 'blue',
            //   hoverBackgroundColor: 'purple',
            //   hoverBorderColor: 'red',
            // },
            // {
            //   data: this.converterDados(refs.filter(r => r.status == "antigo")),
            //   label: 'Antigo',
            //   backgroundColor: 'grey',
            //   borderColor: 'blue',
            //   hoverBackgroundColor: 'purple',
            //   hoverBorderColor: 'red',
            // },
            // {
            //   data: this.converterDados(refs.filter(r => r.status == "novo")),
            //   label: 'Novo',
            //   backgroundColor: 'yellow',
            //   borderColor: 'blue',
            //   hoverBackgroundColor: 'purple',
            //   hoverBorderColor: 'red',
            // },
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