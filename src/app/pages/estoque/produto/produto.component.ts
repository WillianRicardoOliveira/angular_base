import { Produto } from '@/interfaces/interfaces';
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { Base } from '@components/grid/base/base';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss']
})
export class ProdutoComponent extends Base {

  pagina: string = "Produto"
  endPoint = "produto" 
  coluna = ["Nome", "Descricao", "Quantidade", "Minimo", "Maximo"]

  campos(dados?: Produto) {
    return this.builder.group({
      id: [(dados != null ? dados.id : "")],
      nome: [(dados != null ? dados.nome : ""), Validators.compose([
        Validators.required,
        Validators.pattern(/(.|\s)*\S(.|\s)*/),
        Validators.minLength(3),
        Validators.maxLength(100)
      ])],
      descricao: [(dados != null ? dados.descricao : ""), Validators.compose([Validators.maxLength(250)])],
      minimo: [(dados != null ? dados.minimo : ""), Validators.compose([Validators.required])],
      maximo: [(dados != null ? dados.maximo : ""), Validators.compose([Validators.required])]    
    })   
  }

}
