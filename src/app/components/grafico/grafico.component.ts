import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { GraficoService } from 'src/app/services/grafico.service';

@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.component.html',
  styleUrls: ['./grafico.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraficoComponent {

  grafico$: Observable<any>;
  graf: {
    ChartLegend: boolean;
    ChartType: string;
    ChartColors: any;
    ChartOptions: any;
    ChartData: any;
    ChartLabels: any[];
  }
  //{ ChartOptions, ChartLegend, ChartData, ChartType, ChartColors }

  constructor(private grafServ: GraficoService) {
    this.grafico$ = this.grafServ.grafico$()
  }

  public chartClicked(ev): void {
    console.log('click', ev)//this.grafServ.handleChartClick(ev)
  }
}

const chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
};