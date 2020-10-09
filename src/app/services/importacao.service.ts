import { Injectable } from '@angular/core';
import * as xlsx from 'xlsx';
import { AppService } from './app.service';
@Injectable({
  providedIn: 'root'
})
export class ImportacaoService {

  constructor(
    private appServ:AppService
  ) { }

  async salvar(){
    let dados = this.appServ.getRelatorio();
    let wb = xlsx.utils.book_new();
    for (const key in dados) {
      let ws = xlsx.utils.json_to_sheet(dados[key]);
      xlsx.utils.book_append_sheet(wb, ws, key);
    }
    xlsx.writeFile(wb, 'dados.xlsx');
  }

  importar(evt: any) {
    
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: xlsx.WorkBook = xlsx.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: xlsx.WorkSheet = wb.Sheets[wsname];
      let data = xlsx.utils.sheet_to_json(ws);
      this.appServ.carregar(data)
    };
    reader.readAsBinaryString(target.files[0]);
  }
}


