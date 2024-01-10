import { FormaPagamento } from '@/interfaces/interfaces';
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { Base } from '@components/grid/base/base';

@Component({
  selector: 'app-forma-pagamento',
  templateUrl: './forma-pagamento.component.html',
  styleUrls: ['./forma-pagamento.component.scss']
})
export class FormaPagamentoComponent extends Base {

  pagina: string = "Forma de Pagamento"

  endPoint = "formaPagamento"
  
  coluna = ["Nome"]

  campos(dados?: FormaPagamento) {
    return this.builder.group({
      id: [(dados != null ? dados.id : "")],
      nome: [(dados != null ? dados.nome : ""), Validators.compose([
        Validators.required,
        Validators.maxLength(100)
      ])]     
    })   
  }

}
