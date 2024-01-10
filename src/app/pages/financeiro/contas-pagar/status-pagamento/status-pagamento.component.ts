import { StatusPagamento } from '@/interfaces/interfaces';
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { Base } from '@components/grid/base/base';

@Component({
  selector: 'app-status-pagamento',
  templateUrl: './status-pagamento.component.html',
  styleUrls: ['./status-pagamento.component.scss']
})
export class StatusPagamentoComponent extends Base {

  pagina: string = "Status Pagamento"

  endPoint = "statusPagamento"
  
  coluna = ["Nome"]

  campos(dados?: StatusPagamento) {
    return this.builder.group({
      id: [(dados != null ? dados.id : "")],
      nome: [(dados != null ? dados.nome : ""), Validators.compose([
        Validators.required,
        Validators.maxLength(100)
      ])]     
    })   
  }

}
