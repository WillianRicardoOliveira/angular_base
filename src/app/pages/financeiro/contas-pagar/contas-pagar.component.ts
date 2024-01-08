import { ContasApagar } from '@/interfaces/interfaces';
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { Base } from '@components/grid/base/base';

@Component({
  selector: 'app-contas-pagar',
  templateUrl: './contas-pagar.component.html',
  styleUrls: ['./contas-pagar.component.scss']
})
export class ContasPagarComponent extends Base {

  pagina: string = "Contas a Pagar"

  endPoint = "contasPagar"
  
  coluna = ["Fornecedor", "Sub Categoria", "Valor", "Parcelas", "Status", "Metodo Pagamento"]

  campos(dados?: ContasApagar) {
    return this.builder.group({
      id: [(dados != null ? dados.id : "")],
      fornecedor: [(dados != null ? dados.fornecedor : ""), Validators.compose([Validators.required])],
      subCategoria: [(dados != null ? dados.subCategoria : ""), Validators.compose([Validators.required])],
      descricao: [(dados != null ? dados.descricao : ""), Validators.compose([Validators.maxLength(250)])],
      valor: [(dados != null ? dados.valor : ""), Validators.compose([ Validators.required])],
      parcelas: [(dados != null ? dados.parcelas : ""), Validators.compose([ Validators.required])],
      status: [(dados != null ? dados.status : ""), Validators.compose([ Validators.required])],
      metodoPagamento: [(dados != null ? dados.metodoPagamento : ""), Validators.compose([Validators.required])]     
    })   
  }

}