import { CategoriaConta } from '@/interfaces/interfaces';
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { Base } from '@components/grid/base/base';

@Component({
  selector: 'app-categoria-conta',
  templateUrl: './categoria-conta.component.html',
  styleUrls: ['./categoria-conta.component.scss']
})
export class CategoriaContaComponent extends Base {

  pagina: string = "Categoria-Conta"
  endPoint = "categoriaConta"
  coluna = ["Nome"]
  chamar = "sub-categoria-conta"

  campos(dados?: CategoriaConta) {
    return this.builder.group({
      id: [(dados != null ? dados.id : "")],
      nome: [(dados != null ? dados.nome : ""), Validators.compose([
        Validators.required,
        Validators.pattern(/(.|\s)*\S(.|\s)*/),
        Validators.minLength(3),
        Validators.maxLength(100)
      ])]
    })   
  }

}