import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IRegistro } from 'src/app/models/basedados.class';
import { AppService } from 'src/app/services/app.service';
import { Tabela } from '../shared/tabela.class';

@Component({
  selector: 'app-outliers',
  templateUrl: './outliers.component.html',
  styleUrls: ['./outliers.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutliersComponent extends Tabela{

  outliers$ :Observable<IRegistro[]>
  keys: string[]

  constructor(private serv: AppService){
    super();
    this.outliers$ = this.serv.outliers$().pipe(tap(outliers=>{
      if(!outliers) return
      this.linhas_tabela = outliers;
      this.keys = [];
      for (const key in outliers[0]) this.keys.push(key)
      console.log(outliers)
    }))
  }

  retirarOutlier(outlier:IRegistro){
    this.serv.toogleOutlier(outlier._id);
  }

}
