import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Status } from 'src/app/models/basecolunas.class';
import { Conjunto } from 'src/app/models/baseconjuntos.class';
import { AppService } from 'src/app/services/app.service';

@Component({
    selector: 'app-conjcontinuos',
    templateUrl: './conjcontinuos.component.html',
    styleUrls: ['./conjcontinuos.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConjContinuosComponent {

    conjuntos$: Observable<Conjunto[]>
    coluna: string = null

    constructor(private serv: AppService) {
        this.conjuntos$ = this.serv.conjuntos$().pipe(tap(conjs => {
            this.coluna = this.serv.getColunaSelecionada();
        }))
    }

    setColunaStatusVariavel() {
        this.serv.setStatus(this.coluna, Status.VARIAVEL)
    }

    setColunaStatusMetrica() {
        this.serv.setStatus(this.coluna, Status.METRICA)
    }
}