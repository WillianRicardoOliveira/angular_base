import {
    Component,
    Input
} from '@angular/core';

export interface ItemBreadcrumbPagina {
    titulo: string;
    rota?: string;
}

@Component({
    selector: 'app-cabecalho-pagina',
    templateUrl: './cabecalho-pagina.component.html',
    styleUrls: ['./cabecalho-pagina.component.scss'],
    standalone: false
})
export class CabecalhoPaginaComponent {

    @Input()
    pagina = '';

    @Input()
    descricao = '';

    @Input()
    breadcrumb: ItemBreadcrumbPagina[] = [];

}