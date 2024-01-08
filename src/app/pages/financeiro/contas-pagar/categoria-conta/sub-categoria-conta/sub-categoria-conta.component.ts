import { SubCategoriaConta, CategoriaConta} from '@/interfaces/interfaces';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Base } from '@components/grid/base/base';

@Component({
  selector: 'app-sub-categoria-conta',
  templateUrl: './sub-categoria-conta.component.html',
  styleUrls: ['./sub-categoria-conta.component.scss']
})
export class SubCategoriaContaComponent  extends Base{

  pagina: string = "Sub Categoria da Conta";

  endPoint = "subCategoriaConta";
  
  coluna = ["Nome"]

  campos(dados?: SubCategoriaConta) {
    return this.builder.group({
      id: [(dados != null ? dados.id : "")],
      categoriaConta: [this.outroId, Validators.compose([Validators.required])],
      nome: [(dados != null ? dados.nome : ""), Validators.compose([
        Validators.required,
        Validators.pattern(/(.|\s)*\S(.|\s)*/),
        Validators.minLength(3),
        Validators.maxLength(100)
      ])]
    })   
  }


  

  
}
