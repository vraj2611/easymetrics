import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { Grupo } from 'src/app/models/grupo.class';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GruposComponent {

  sort: Sort = null;
  filtro:string = null;
  filtrados:number = 0;
  grupos$: Observable<Grupo[]>
  colunas_tabela: any[] = [];
  coluna: string = null
  
  constructor(private serv: AppService) {
    this.grupos$ = this.serv.grupos$().pipe(tap(cols=>{
      this.coluna = this.serv.getColunaSelecionada();
      if(cols) this.colunas_tabela = cols.map(this.tratarRow);
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
    const data = this.serv.getGrupos(this.coluna).map(this.tratarRow);
    const ord = this.ordenar(data, this.sort);
    const filtro = this.filtrar(ord, this.filtro);
    this.filtrados = filtro.length;
    this.colunas_tabela = filtro;
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

  setGrupoFiltro(grupo:Grupo, filtro:number){
    this.serv.setFiltro({
      grupo: grupo.nome,
      coluna: grupo.coluna,
      filtro: filtro
    });
  }

  setColunaStatus(status){
    this.serv.setStatus(this.coluna, status)
    console.log("");
  }
}
