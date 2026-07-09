
import { Component, Input } from '@angular/core';


@Component({
    selector: 'app-aviso',
    templateUrl: './aviso.component.html',
    styleUrls: ['./aviso.component.scss'],
    standalone: false
})
export class AvisoComponent {


  @Input() dados: any

}
