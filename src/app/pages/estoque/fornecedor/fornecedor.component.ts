import { Fornecedor } from '@/interfaces/interfaces';
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { Base } from '@components/grid/base/base';

@Component({
  selector: 'app-fornecedor',
  templateUrl: './fornecedor.component.html',
  styleUrls: ['./fornecedor.component.scss']
})
export class FornecedorComponent extends Base {

  pagina: string = "Fornecedor"
  endPoint = "fornecedor"
  coluna = ["CNPJ", "Nome", "Telefone"]

  campos(dados?: Fornecedor) {
    return this.builder.group({
      id: [(dados != null ? dados.id : "")],
      cnpj: [(dados != null ? dados.cnpj : ""), Validators.compose([Validators.required])],
      nome: [(dados != null ? dados.nome : ""), Validators.compose([
        Validators.required,
        Validators.pattern(/(.|\s)*\S(.|\s)*/),
        Validators.minLength(3),
        Validators.maxLength(100)
      ])],
      telefone: [(dados != null ? dados.telefone : ""), Validators.compose([Validators.required])],
      descricao: [(dados != null ? dados.descricao : ""), Validators.compose([Validators.maxLength(250)])]
    })   
  }

}
