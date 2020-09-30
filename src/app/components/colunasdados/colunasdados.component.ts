import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Coluna } from 'src/app/models/coluna.class';
import { DadosService } from 'src/app/services/dados.service';


@Component({
  selector: 'app-colunasdados',
  templateUrl: './colunasdados.component.html',
  styleUrls: ['./colunasdados.component.css']
})
export class ColunasdadosComponent implements OnInit {


  colunas$: Observable<Coluna[]>

  constructor(private dserv: DadosService) {
    this.colunas$ = this.dserv.colunas$()
  }

  ngOnInit(): void {
  }

}
