import { ViewChild, Input, Directive } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Directive()
export class TabelaGenerica {

  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @Input() titulo: string = "Tabela de Itens";
  @Input() dados: any[] = [];
  @Input() isBlocked: boolean = false;

  ngOnChanges(changes) {
    if (!changes.dados) return;
    let lista = changes.dados.currentValue;
    if (!lista) return;
    this.atualizarRows(lista);
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

  tratarRow(row) {
    return row;
  }

  exportarDados() {
    let data:Object[] = this.dados.map(this.tratarRow);
    let csv = '';
    csv += Object.keys(data[0]).join(';');
    csv += "\n";
    
    data.forEach((row)=> {
      csv += Object.values(row).join(';');
      csv += "\n";
    });

    let hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = this.titulo.toLocaleLowerCase().replace(' ','_')+'.csv';
    hiddenElement.click();
  }
}
