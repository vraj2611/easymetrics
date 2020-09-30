import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color } from 'ng2-charts';
import { IReferencia } from 'src/app/models';
import { IEstatistica } from 'src/app/services';

export class Grafico {

  public ChartLegend = true;
  public ChartType = 'bubble';
  private _dataSets: ChartDataSets[] = null;
  public ChartOptions: ChartOptions = {
    animation: { duration: 0 },
    responsive: true
  };

  setChartOptions(min_data:Date): void {
    this.ChartOptions = {
      animation: { duration: 0 },
      responsive: true,
      maintainAspectRatio: false,
      legend: {position: 'bottom'},
      scales: {
        xAxes: [{
          type: 'time',
          ticks: { max: new Date(), min: new Date(min_data.getFullYear(), min_data.getMonth() -1, 1)}
        }],
        yAxes: [
          {}
        ]
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            let info = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
            return JSON.parse(info['d'])['tag'];
          }
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

  converterDados(refs: IReferencia[]) {
    return refs.map((r, i) => {
      return {
        x: r.data_origem,
        y: r.valor_atual,
        r: 8,
        t: r.data_origem,
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

  getDataSets(refs: IReferencia[], estatistica: IEstatistica): ChartDataSets[] {
    this.setDataSets(refs, estatistica);
    return this._dataSets;
  }

  setDataSets(refs: IReferencia[], estatistica: IEstatistica): void {
    this.setChartOptions(estatistica.menor_data);
    this._dataSets = [
      {
        data: this.converterDados(refs.filter(r => r.status == "incluso")),
        label: 'Inclusos',
        backgroundColor: 'green',
        borderColor: 'blue',
        hoverBackgroundColor: 'purple',
        hoverBorderColor: 'red'
      },
      {
        data: this.converterDados(refs.filter(r => r.status == "excluido")),
        label: 'Excluidos',
        backgroundColor: 'red',
        borderColor: 'blue',
        hoverBackgroundColor: 'purple',
        hoverBorderColor: 'red',
      },
      {
        data: this.converterDados(refs.filter(r => r.status == "antigo")),
        label: 'Antigo',
        backgroundColor: 'grey',
        borderColor: 'blue',
        hoverBackgroundColor: 'purple',
        hoverBorderColor: 'red',
      },
      {
        data: this.converterDados(refs.filter(r => r.status == "novo")),
        label: 'Novo',
        backgroundColor: 'yellow',
        borderColor: 'blue',
        hoverBackgroundColor: 'purple',
        hoverBorderColor: 'red',
      },
      {
        data: [
          { x: estatistica.menor_data, y: estatistica.media },
          { x: estatistica.maior_data, y: estatistica.media },
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
          { x: estatistica.menor_data, y: estatistica.media + estatistica.desviopadrao },
          { x: estatistica.maior_data, y: estatistica.media + estatistica.desviopadrao },
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
          { x: estatistica.maior_data, y: estatistica.media - estatistica.desviopadrao },
          { x: estatistica.menor_data, y: estatistica.media - estatistica.desviopadrao },
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