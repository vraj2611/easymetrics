import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { Conjunto } from 'src/app/models/baseconjuntos.class';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Status } from 'src/app/models/basecolunas.class';
import { Tabela } from '../../shared/tabela.class';

@Component({
  selector: 'app-conjdiscretos',
  templateUrl: './conjdiscretos.component.html',
  styleUrls: ['./conjdiscretos.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConjDiscretosComponent extends Tabela {

  conjuntos$: Observable<Conjunto[]>
  coluna: string = null

  constructor(private serv: AppService) {
    super();
    this.conjuntos$ = this.serv.conjuntos$().pipe(tap(conjs => {
      this.coluna = this.serv.getColunaSelecionada();
      if (conjs) this.linhas_tabela = conjs.map(this.tratarRow);
    }))
  }

  getDadosAtuais() {
    return this.serv.getConjuntos(this.coluna).map(this.tratarRow);
  }

  tratarRow(row: Conjunto) {
    let media = 0;
    let coef = 0;
    let min = 0;
    let max = 0;
    if (row.analise) {
      media = row.analise?.y?.media || media;
      coef = row.analise?.y?.coef_var || coef;
      max = row.analise?.y?.max || max;
      min = row.analise?.y?.min || min;
    }
    return {
      nome: row.nome,
      coluna: row.coluna,
      quantidade: row.ids.size,
      outliers: row.outliers.size,
      media: Math.round(media * 100) / 100,
      coef_var: Math.round(coef * 100) / 100,
      max: Math.round(max * 100) / 100,
      min: Math.round(min * 100) / 100,
      filtro: row.filtro
    }
  }

  setConjuntoFiltro(conj: Conjunto, filtro: number) {
    this.serv.setFiltro({
      conjunto: conj.nome,
      coluna: conj.coluna,
      filtro: filtro
    });
  }

  setColunaStatusGrupo() {
    this.serv.setStatus(this.coluna, Status.GRUPO)
  }

  setColunaStatusVariavel() {
    this.serv.setStatus(this.coluna, Status.VARIAVEL)
  }

  setColunaStatusMetrica() {
    this.serv.setStatus(this.coluna, Status.METRICA)
  }
}
