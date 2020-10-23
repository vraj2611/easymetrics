import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ImportacaoService } from 'src/app/services/importacao.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent{

  arquivoCarregado$:Observable<[string,number]>

  importado:boolean = false
  constructor(
    private serv:ImportacaoService
  ) {
    this.arquivoCarregado$ = this.serv.arquivoCarregado$()
  }

  
  selecionarArquivo(event) {
    this.serv.importar(event);
    this.importado = true;
  }

  salvar(){
    this.serv.salvar();
  }



}
