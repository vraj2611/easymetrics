import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IFiltro } from 'src/app/models/basedados.class';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltrosComponent {

  filtros$:Observable<IFiltro[]>;
  inclusoes:any[] = [];
  exclusoes:any[] = [];

  constructor(private serv:AppService){
    this.filtros$ = this.serv.filtros$().pipe(tap(fs=>{
      if(!fs) return
      this.inclusoes = fs.filter(f=> f.filtro > 0);
      this.exclusoes = fs.filter(f=> f.filtro < 0);
    }))
  }

  removeFiltro(f:IFiltro){
    f.filtro = 0;
    this.serv.setFiltro(f);
  }
}
