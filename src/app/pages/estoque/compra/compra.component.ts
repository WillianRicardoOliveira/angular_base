import { Compra } from '@/interfaces/interfaces';
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { Base } from '@components/grid/base/base';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.scss']
})
export class CompraComponent extends Base {

  pagina: string = "Compra"

  endPoint = "compra"

  chamar = "compra-item"
  
  coluna = ["Descrição", "Status"]

  campos(dados?: Compra) {
    return this.builder.group({
      id: [(dados != null ? dados.id : "")],
      nome: [(dados != null ? dados.nome : ""), Validators.compose([
        Validators.required,
        Validators.maxLength(100)
      ])],
      descricao: [(dados != null ? dados.descricao : ""), Validators.compose([
        Validators.maxLength(250)
      ])]
    })   
  }

}
