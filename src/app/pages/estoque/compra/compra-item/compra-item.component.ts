import { CompraItem, Fornecedor, Produto } from '@/interfaces/interfaces';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Base } from '@components/grid/base/base';

@Component({
  selector: 'app-compra-item',
  templateUrl: './compra-item.component.html',
  styleUrls: ['./compra-item.component.scss']
})
export class CompraItemComponent extends Base {

  pagina: string = "Intens da compra";

  endPoint = "compraItem";
  
  coluna = ["Fornecedor", "Produto", "Quantidade", "Valor", "Total"]
  
  formatarComoMoeda = ["valor", "total"]

  campos(dados?: CompraItem) {
    if(dados != null){
      this.fornecedorControl.setValue(dados.fornecedor)
      this.produtoControl.setValue(dados.produto)
    }
    return this.builder.group({   
      id: [(dados != null ? dados.id : "")],
      compra: [this.outroId, Validators.compose([Validators.required])],
      fornecedor: [(dados != null ? dados.fornecedor : ""), Validators.compose([Validators.required])],
      produto: [(dados != null ? dados.produto : ""), Validators.compose([Validators.required])],
      quantidade: [(dados != null ? dados.quantidade : ""), Validators.compose([Validators.required])],
      valor: [(dados != null ? dados.valor : ""), Validators.compose([ Validators.required])],
    })   
  }
      
}
