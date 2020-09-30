import { ViewChild, Input, Directive } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Directive()
export class TabelaGenerica {

  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  //@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  //@ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatSort, { static: false })
  set sort(v: MatSort) {
   this.dataSource.sort = v;
  }

  @ViewChild(MatPaginator, { static: false })
  set paginator(v: MatPaginator) {
    this.dataSource.paginator = v;
  }

  atualizarRows(lista) {
    this.dataSource = new MatTableDataSource(lista.map(this.tratarRow));
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  tratarRow(row):any {
    return row;
  }

  exportarDados() {
    let data:Object[] = [].map(this.tratarRow);
    let csv = '';
    console.log(data);
    csv += Object.keys(data[0]).join(';');
    csv += "\n";
    
    data.forEach((row)=> {
      csv += Object.values(row).join(';');
      csv += "\n";
    });

    let hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = "Arquivo".toLocaleLowerCase().replace(' ','_')+'.csv';
    hiddenElement.click();
  }
}
