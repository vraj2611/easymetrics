import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/shared/header/header.component';
import { MaterialDesignModule } from './components/materialdesign.module';
import { ImportacaoService } from './services/importacao.service';
import { AppService } from './services/app.service';
import { ChartsModule } from 'ng2-charts';
import { ColunasComponent } from './components/colunas/colunas.component';
import { GraficoComponent } from './components/grafico/grafico.component';
import { FiltrosComponent } from './components/filtros/filtros.component';
import { GraficoService } from './services/grafico.service';
import { OutliersComponent } from './components/outliers/outliers.component';
import { ConjuntosComponent } from './components/conjuntos/conjuntos.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ColunasComponent,
    ConjuntosComponent,
    GraficoComponent,
    FiltrosComponent,
    OutliersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialDesignModule,
    ChartsModule
  ],
  providers: [
    ImportacaoService,
    AppService,
    GraficoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
