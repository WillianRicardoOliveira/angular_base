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
  
  coluna = ["Fornecedor", "Sub Categoria", "Valor", "Parcelas", "Status Pagamento", "Forma Pagamento"]

  formatarComoMoeda = ["valor"]

  campos(dados?: ContasApagar) {
    if(dados != null){
      this.fornecedorControl.setValue(dados.fornecedor)
      this.categoriaContaControl.setValue(dados.categoriaConta)
      this.subCategoriaContaControl.setValue(dados.subCategoriaConta)
      this.statusPagamentoControl.setValue(dados.statusPagamento)
      this.formaPagamentoControl.setValue(dados.formaPagamento)
    }
    return this.builder.group({
      id: [(dados != null ? dados.id : "")],
      fornecedor: [(dados != null ? dados.fornecedor : ""), Validators.compose([Validators.required])],
      categoriaConta: [(dados != null ? dados.categoriaConta : ""), Validators.compose([Validators.required])],
      subCategoriaConta: [(dados != null ? dados.subCategoriaConta : ""), Validators.compose([Validators.required])],
      descricao: [(dados != null ? dados.descricao : ""), Validators.compose([Validators.maxLength(250)])],
      valor: [(dados != null ? dados.valor : ""), Validators.compose([ Validators.required])],
      parcelas: [(dados != null ? dados.parcelas : ""), Validators.compose([ Validators.required])],
      statusPagamento: [(dados != null ? dados.statusPagamento : ""), Validators.compose([ Validators.required])],
      formaPagamento: [(dados != null ? dados.formaPagamento : ""), Validators.compose([Validators.required])]     
    })   
  }

}