import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cabecalho-pagina',
  templateUrl: './cabecalho-pagina.component.html',
  styleUrls: ['./cabecalho-pagina.component.scss']
})
export class CabecalhoPaginaComponent {

  @Input() param: any

}
