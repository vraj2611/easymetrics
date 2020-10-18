import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { Coluna, Status } from 'src/app/models/basecolunas.class';
import { AppService } from 'src/app/services/app.service';
import { Tabela } from '../shared/tabela.class';

@Component({
  selector: 'app-colunas',
  templateUrl: './colunas.component.html',
  styleUrls: ['./colunas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColunasComponent extends Tabela {

  colunas$: Observable<Coluna[]>
  constructor(private serv: AppService) {
    super();
    this.colunas$ = this.serv.colunas$().pipe(tap(cols => {
      this.linhas_tabela = cols;
    }))
  }

  getDadosAtuais() {
    return this.serv.getColunas();
  }

  selecionarColuna(coluna: string) {
    this.serv.selecionarColuna(coluna);
  }

  setColunaStatusGrupo(col:Coluna) {
    this.serv.setStatus(col.nome, Status.GRUPO)
  }

  setColunaStatusVariavel(col:Coluna) {
    this.serv.setStatus(col.nome, Status.VARIAVEL)
  }

  setColunaStatusMetrica(col:Coluna) {
    this.serv.setStatus(col.nome, Status.METRICA)
  }

  setColunaVisivel(col:Coluna){
    this.serv.toogleExibir(col.nome)
  }
}

