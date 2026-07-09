import { Conteudo } from '@/interfaces/interfaces';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-card-busca',
    templateUrl: './card-busca.component.html',
    styleUrls: ['./card-busca.component.scss'],
    standalone: false
})
export class CardBuscaComponent {
  @Input() conteudo!: Conteudo;
}
