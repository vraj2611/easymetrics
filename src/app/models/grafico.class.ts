import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color } from 'ng2-charts';

export class Grafico {

  public ChartLegend = true;
  public ChartType = 'bubble';
  private _dataSets: ChartDataSets[] = null;
  public ChartOptions: ChartOptions = {
    animation: { duration: 0 },
    responsive: true
  };

  setChartOptions(min: number, max:number): void {
    this.ChartOptions = {
      animation: { duration: 0 },
      responsive: true,
      maintainAspectRatio: false,
      legend: {position: 'bottom'},
      scales: {
        xAxes: [{
          // type: 'num
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
    console.log(this.converterDados(refs));
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