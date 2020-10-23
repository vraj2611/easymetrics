import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { IGrafico } from 'src/app/models/grafico.class';
import { AppService } from 'src/app/services/app.service';

@Component({
	selector: 'app-grafico',
	templateUrl: './grafico.component.html',
	styleUrls: ['./grafico.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraficoComponent {

	grafico$: Observable<any>;
	graf: IGrafico;
	limite: {
		xmax: number,
		xmin: number,
		ymax: number,
		ymin: number,
	}

	constructor(private serv: AppService) {
		this.grafico$ = this.serv.grafico$();
		this.limite = { xmax: null, xmin: null, ymax: null, ymin: null };
	}

	public chartClicked(ev): void {
		if (!ev['active'][0]) return
		this.serv.clickPontoGrafico(
			ev['active'][0]['_datasetIndex'],
			ev['active'][0]['_index']
		);
	}

	resizeGrafico() {
		console.log(this.limite)
	}

	setTam(v:number){
		
	}

	setXmin(v: number) {
		this.limite.xmin = +v || null;
	}

	setXmax(v: number) {
		this.limite.xmax = +v || null;
	}

	setYmin(v: number) {
		this.limite.ymin = +v || null;
	}

	setYmax(v: number) {
		this.limite.ymax = +v || null;
	}
}
