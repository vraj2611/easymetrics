import { Component, OnInit } from '@angular/core';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private excel:ExcelService
  ) { }

  ngOnInit(): void {
  }

  clickOnHidden() {
    console.log("ok")
  }

  selecionarArquivo(event) {
    this.excel.importar(event);
  }



}
