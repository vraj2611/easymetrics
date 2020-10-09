import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { Coluna } from 'src/app/models/coluna.class';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-colunas',
  templateUrl: './colunas.component.html',
  styleUrls: ['./colunas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColunasComponent {

  sort: Sort = null;
  filtro:string = null;
  colunas$: Observable<Coluna[]>
  cols_ordenadas: any[] = [];
  constructor(private dserv: AppService) {
    this.colunas$ = this.dserv.colunas$().pipe(tap(cols=>{
      this.cols_ordenadas = cols;
    }))
  }

  setSort(sort:Sort){
    this.sort = sort;
    this.atualizar();
  }

  setFiltro(filtro:string){
    this.filtro = filtro.trim().toLowerCase();
    this.atualizar();
  }

  atualizar(){
    const data = this.dserv.getColunas();
    const ord = this.ordenar(data, this.sort);
    const filtro = this.filtrar(ord, this.filtro);
    this.cols_ordenadas = filtro;
  }

  ordenar(colunas: any[], sort:Sort):any[] {
    if (!sort || !sort.active || sort.direction === '') {
      return colunas;
    }

    return colunas.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      const key = sort.active;
      return (a[key] < b[key] ? -1 : 1) * (isAsc ? 1 : -1);
    });
  }

  filtrar(data:any[], filtro:string):any[]{
    if (!filtro) return data

    return data.filter(item=>{
      for (const key in item) {
        if(String(item[key]).toLowerCase().indexOf(this.filtro) >= 0) return true
      }
      return false
    })
  }

  selecionarColuna(coluna:string){
    this.dserv.selecionarColuna(coluna);
  }
}

// setGrupo() {
  //   this.dserv.setStatus(this.coluna.nome, Status.GRUPO);
  // }

  // setVariavel() {
  //   this.dserv.setStatus(this.coluna.nome, Status.VARIAVEL);
  // }

  // setMetrica() {
  //   this.dserv.setStatus(this.coluna.nome, Status.METRICA);
  // }

  // setStatusNulo() {
  //   this.dserv.setStatus(this.coluna.nome, Status.NULO);
  // }

  // grupoAtivo() {
  //   return this.coluna.status == Status.GRUPO
  // }

  // variavelAtivo() {
  //   return this.coluna.status == Status.VARIAVEL
  // }

  // metricaAtivo() {
  //   return this.coluna.status == Status.METRICA
  // }

  // semStatus() {
  //   return this.coluna.status == Status.NULO
  // }

