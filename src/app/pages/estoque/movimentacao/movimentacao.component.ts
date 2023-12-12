import { Movimentacao, Produto, TipoMovimentacao } from '@/interfaces/interfaces';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
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
  compra: number
  tipoMovimentacaoControl = new FormControl<TipoMovimentacao | null>(null, Validators.required);
  produtoControl = new FormControl<Produto | null>(null, Validators.required);

  campos(dados?: Movimentacao) {
    return this.builder.group({
      tipoMovimentacao: ["", Validators.compose([Validators.required])],
      compra: [this.compra, Validators.compose([Validators.required])],
      produto: ["", Validators.compose([Validators.required])],
      quantidade: ["", Validators.compose([Validators.required])],
    })   
  }

}
