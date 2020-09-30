import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DadosService } from 'src/app/services/dados.service';
import { TabelaGenerica } from '../shared/tabelagenerica.class';

@Component({
  selector: 'app-tabeladados',
  templateUrl: './tabeladados.component.html',
  styleUrls: ['./tabeladados.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabeladadosComponent extends TabelaGenerica {

  dados$: Observable<any[]>

  constructor(private dserv: DadosService) {
    super();
    this.dados$ = this.dserv.dados$().pipe(map(d=>{
      console.log(d.length)
      this.atualizarRows(d);
      return [];
    }))

  }
}
