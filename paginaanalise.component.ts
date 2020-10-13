import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GestaoEntidade } from '../../shared';
import { Especificacao } from 'src/app/models';
import { EspecificacaoService, IEstatistica } from 'src/app/services';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartDataSets } from 'chart.js';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Grafico } from './src/app/components/graficodados/grafico.class';


@Component({
  selector: 'app-paginaanalise',
  templateUrl: './paginaanalise.component.html',
  styleUrls: ['./paginaanalise.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginaanaliseComponent extends GestaoEntidade<Especificacao>{

  referencias$:Observable<any>;
  moedas$:Observable<any>;
  graf = new Grafico();
  ChartData: ChartDataSets[] = [{data:[{}]}];
  estatistica: IEstatistica = null;
  id_espec:number;

  constructor(
    protected serv: EspecificacaoService,
    protected route:ActivatedRoute,
    private router:Router
  ) {
    super(serv, route);
    
    this.referencias$ = this.serv.referencias$().pipe(map(r=>{
      if(!r) return r;
      this.estatistica = this.serv.getEstatistiscas();
      this.ChartData = this.graf.getDataSets(r, this.estatistica);
      return r;
    }));
    
    this.entity$ = this.serv.entity$().pipe(map(x=>{
      if (!x) return x;
      this.titulo.texto = "Analise da Espec. "+ x.tag;
      this.id_espec = x.id;
      return x;
    }))

    this.moedas$ = this.serv.listaMoedas$();
  }

  loadById(id:number){
    super.loadById(id);
    this.serv.loadRefs(id);
  }

  titulo = {
    texto: "Análise de Especificação",
    icone: "account_balance"
  };

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    if (this.isBlocked) return;
    
    let point = this.graf.getChartPoint(active[0]['_datasetIndex'], active[0]['_index']);
    let dados = JSON.parse(point['d']);

    if(dados['status'] == 'excluido') this.serv.incluirRef(dados['id'])
    if(dados['status'] == 'incluso') this.serv.excluirRef(dados['id'])
    if(dados['status'] == 'novo') this.serv.incluirRef(dados['id'])
  }

  incluirTodas(){
    this.serv.incluirTodasRefs();
  }

  setMoedaAtual(moeda:string){
    this.serv.setMoedaAtual(moeda);
  }

  setDataCorte(data:any){
    this.serv.setDataCorte(data);
  }

  voltar(){
   this.router.navigate(['/especificacao/'+this.id_espec])
  }

}
