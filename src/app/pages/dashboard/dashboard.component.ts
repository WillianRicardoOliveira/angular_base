import {Component} from '@angular/core';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  informacoes = {
    descricao: "Usuários registrados",
    total: 34,
    rota: "/lista-usuario"
  }

  pagina: string = "Dashboard"
    
}
