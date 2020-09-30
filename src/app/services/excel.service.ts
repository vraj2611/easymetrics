import { Injectable } from '@angular/core';
import * as xlsx from 'xlsx';
import { IRegistro } from '../models/coluna.class';
import { DadosService } from './dados.service';
@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor(
    private dadosServ:DadosService
  ) { }


  importar(evt: any) {
    
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: xlsx.WorkBook = xlsx.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: xlsx.WorkSheet = wb.Sheets[wsname];
      let data = <IRegistro[]>xlsx.utils.sheet_to_json(ws);
      this.dadosServ.carregar(data);
    };
    reader.readAsBinaryString(target.files[0]);
  }
}


