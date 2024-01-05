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

  


}
