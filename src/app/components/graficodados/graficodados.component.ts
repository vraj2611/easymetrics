import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GraficoService } from 'src/app/services/grafico.service';
import { ChartDataSets } from 'chart.js';
import { Grafico } from './grafico.class';

@Component({
  selector: 'app-graficodados',
  templateUrl: './graficodados.component.html',
  styleUrls: ['./graficodados.component.css']
})
export class GraficodadosComponent implements OnInit {

  grafico$:Observable<any>;
  graf = new Grafico();
  ChartData: ChartDataSets[] = [{data:[{}]}];
  
  constructor(private grafServ:GraficoService) {
    this.grafico$ = this.grafServ.grafico$();
  }

  ngOnInit(): void {
  }

  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {

    
    let point = this.graf.getChartPoint(active[0]['_datasetIndex'], active[0]['_index']);
    let dados = JSON.parse(point['d']);

  }

}
