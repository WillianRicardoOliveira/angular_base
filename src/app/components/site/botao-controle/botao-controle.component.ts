import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-botao-controle',
    templateUrl: './botao-controle.component.html',
    styleUrls: ['./botao-controle.component.scss'],
    standalone: false
})
export class BotaoControleComponent {
  @Input() operacao: 'incrementar' | 'decrementar' = "incrementar";
  @Input() src = '';
  @Input() alt = '';
}
