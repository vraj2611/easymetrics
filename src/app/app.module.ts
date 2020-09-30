import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/shared/header/header.component';
import { MaterialDesignModule } from './components/materialdesign.module';
import { ExcelService } from './services/excel.service';
import { ColunasdadosComponent } from './components/colunasdados/colunasdados.component';
import { GraficodadosComponent } from './components/graficodados/graficodados.component';
import { TabeladadosComponent } from './components/tabeladados/tabeladados.component';
import { ColunasDetalheComponent } from './components/colunasdados/colunasdetalhe/colunasdetalhe.component';
import { DadosService } from './services/dados.service';
import { AnaliseService } from './services/analise.service';
import { GraficoService } from './services/grafico.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ColunasdadosComponent,
    ColunasDetalheComponent,
    GraficodadosComponent,
    TabeladadosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialDesignModule
  ],
  providers: [
    ExcelService,
    DadosService,
    AnaliseService,
    GraficoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
