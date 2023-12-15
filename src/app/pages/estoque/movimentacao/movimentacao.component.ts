import { Movimentacao } from '@/interfaces/interfaces';
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { Base } from '@components/grid/base/base';

@Component({
  selector: 'app-movimentacao',
  templateUrl: './movimentacao.component.html',
  styleUrls: ['./movimentacao.component.scss']
})
export class MovimentacaoComponent extends Base {

  pagina: string = "Movimentação"
  endPoint = "movimentacao"
  coluna = ["Tipo", "Produto", "Quantidade", "Total", "Data"]
  
  campos(dados?: Movimentacao) {
    if(dados != null){
      this.tipoMovimentacaoControl.setValue(dados.tipoMovimentacao)
      this.produtoControl.setValue(dados.produto)
    }
    return this.builder.group({
      id: [(dados != null ? dados.id : "")],
      tipoMovimentacao: [(dados != null ? dados.tipoMovimentacao : ""), Validators.compose([Validators.required])],
      produto: [(dados != null ? dados.produto : "")],
      quantidade: [(dados != null ? dados.quantidade : ""), Validators.compose([Validators.required])],
    })   
  }

}
