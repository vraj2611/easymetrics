import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { Conjunto } from 'src/app/models/baseconjuntos.class';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
	selector: 'app-conjuntos',
	templateUrl: './conjuntos.component.html',
	styleUrls: ['./conjuntos.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConjuntosComponent {

	conjuntos$: Observable<Conjunto[]>
	isConjuntoContinuo: boolean;

	constructor(private serv: AppService) {
		this.conjuntos$ = this.serv.conjuntos$().pipe(tap(conjs => {
			this.isConjuntoContinuo = (conjs?.length == 1 && conjs[0].nome == '_numeros')
		}))
	}

}
