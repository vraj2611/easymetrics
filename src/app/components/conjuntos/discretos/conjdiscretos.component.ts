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
    return {
      nome: row.nome,
      coluna: row.coluna,
      quantidade: row.ids.size,
      filtro: row.filtro,
      media: row.analise?.y?.media,
      formula: row.analise?.regressao?.formula,
      coef_var: row.analise?.y?.coef_var
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
