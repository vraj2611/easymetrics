import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ImportacaoService } from 'src/app/services/importacao.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent{

  importado:boolean = false
  constructor(
    private serv:ImportacaoService
  ) { }

  
  selecionarArquivo(event) {
    this.serv.importar(event);
    this.importado = true;
  }

  salvar(){
    this.serv.salvar();
  }



}
