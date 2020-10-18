import { Sort } from '@angular/material/sort';

export class Tabela {

    linhas_tabela: any[];
    sort: Sort = null;
    filtro: string = null;
    filtrados: number = null;

    getDadosAtuais() {
        return [];
    }

    setSort(sort: Sort) {
        this.sort = sort;
        this.atualizar();
    }

    setFiltro(filtro: string) {
        this.filtro = filtro.trim().toLowerCase();
        this.atualizar();
    }

    atualizar() {
        const data = this.getDadosAtuais();
        const ord = this.ordenar(data, this.sort);
        const filtro = this.filtrar(ord, this.filtro);
        this.filtrados = filtro.length;
        this.linhas_tabela = filtro;
    }

    ordenar(linhas: any[], sort: Sort): any[] {
        if (!sort || !sort.active || sort.direction === '') {
            return linhas;
        }

        return linhas.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            const key = sort.active;
            return (a[key] < b[key] ? -1 : 1) * (isAsc ? 1 : -1);
        });
    }

    filtrar(linhas: any[], filtro: string): any[] {
        if (!filtro) return linhas

        return linhas.filter(item => {
            for (const key in item) {
                if (String(item[key]).toLowerCase().indexOf(this.filtro) >= 0) return true
            }
            return false
        })
    }

}