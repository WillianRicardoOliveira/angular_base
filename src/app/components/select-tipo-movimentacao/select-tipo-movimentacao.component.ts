import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TipoMovimentacao } from '@/interfaces/interfaces';

@Component({
  selector: 'app-select-tipo-movimentacao',
  templateUrl: './select-tipo-movimentacao.component.html',
  styleUrls: ['./select-tipo-movimentacao.component.scss']
})
export class SelectTipoMovimentacaoComponent {

  @Input() control: FormControl;

  tipos: TipoMovimentacao[] = [
    {value: 'DEVOLUCAO', viewValue: 'Devolução'},
    {value: 'DANOS', viewValue: 'Danos'},
    {value: 'ENTRADA', viewValue: 'Entrada'},
    {value: 'SAIDA', viewValue: 'Saída'},
    {value: 'INVENTARIO', viewValue: 'Inventário'},
  ];

  selectedTipo = this.tipos[2].value;

}
