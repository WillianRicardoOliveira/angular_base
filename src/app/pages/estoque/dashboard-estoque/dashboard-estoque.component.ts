import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-estoque',
  templateUrl: './dashboard-estoque.component.html',
  styleUrls: ['./dashboard-estoque.component.scss']
})
export class DashboardEstoqueComponent implements OnInit {
  
  informacoes = {
    descricao: "Clientes",
    total: 35,
    rota: "/lista-usuario"
  }

  param = {

    titulo: "Dashboard",
    pagina: "Dashboard"

  }

  constructor() {}
  
  ngOnInit(): void {

  }

}
