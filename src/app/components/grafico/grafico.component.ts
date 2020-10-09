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

  constructor(private grafServ: GraficoService) {
    this.grafico$ = this.grafServ.grafico$()
  }

  public chartClicked(ev): void {
    this.grafServ.handleChartClick(ev)
  }

}
