import { Component, OnInit } from '@angular/core';
import { Coluna, Status } from 'src/app/models/coluna.class';
import { DadosService } from 'src/app/services/dados.service';
import { Input } from '@angular/core';
import { TabelaGenerica } from '../../shared/tabelagenerica.class';
import { SimpleChanges } from '@angular/core';
import { Grupo } from 'src/app/models/grupo.class';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-colunasdetalhe',
  templateUrl: './colunasdetalhe.component.html',
  styleUrls: ['./colunasdetalhe.component.css']
})
export class ColunasDetalheComponent extends TabelaGenerica {

  @Input() coluna:Coluna;
  grupos$:Observable<any>

  constructor(private dserv: DadosService) {
    super();
    this.grupos$ = this.dserv.grupos$().pipe(map(gs=>{
      let x = gs.filter(g=>g.coluna == this.coluna.nome)
      this.atualizarRows(x)
      return x
    }))
  }

  displayedColumns: string[] = ['valor', 'quantidade', 'outliers', 'media', 'coef_var', 'min', 'max', 'filtrar'];

  tratarRow(row: Grupo) {
    let media = 0;
    let coef = 0;
    let min = 0;
    let max = 0;
    if (row.analise) {
      media = row.analise.y.media;
      coef = row.analise.y.coef_var;
      max = row.analise.y.max;
      min = row.analise.y.min;
    }
    return {
      valor: row.nome,
      quantidade: row.ids.size,
      outliers: row.outliers.size,
      media: Math.round(media * 100) / 100,
      coef_var: Math.round(coef * 100) / 100,
      max: max,
      min: min
    }
  }

  setGrupo() {
    this.dserv.setStatus(this.coluna.nome, Status.GRUPO);
  }

  setVariavel() {
    this.dserv.setStatus(this.coluna.nome, Status.VARIAVEL);
  }

  setMetrica() {
    this.dserv.setStatus(this.coluna.nome, Status.METRICA);
  }

  setStatusNulo() {
    this.dserv.setStatus(this.coluna.nome, Status.NULO);
  }

  grupoAtivo() {
    return this.coluna.status == Status.GRUPO
  }

  variavelAtivo() {
    return this.coluna.status == Status.VARIAVEL
  }

  metricaAtivo() {
    return this.coluna.status == Status.METRICA
  }

  semStatus() {
    return this.coluna.status == Status.NULO
  }
}
