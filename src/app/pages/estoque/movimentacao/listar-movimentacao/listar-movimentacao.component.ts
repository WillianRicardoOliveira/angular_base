import { Component, OnInit } from '@angular/core';
import { BaseService } from '@services/base/base.service';
import { Movimentacao } from '../movimentacao';

@Component({
  selector: 'app-listar-movimentacao',
  templateUrl: './listar-movimentacao.component.html',
  styleUrls: ['./listar-movimentacao.component.scss']
})
export class ListarMovimentacaoComponent implements OnInit {

  lista: Movimentacao[] = []

  campos: any = ["Id", "Nome",
    
    "Tipo",
    "Quantidade",
    "Total",
    "Data"
  ]

  parametros = {
    rota_criar: "/criar-movimentacao",
    rota_editar: "/editar-movimentacao",
    rota_listar: "/listar-movimentacao",
    gateway: "movimentacao",



  }

  constructor(private service: BaseService) {}

  ngOnInit(): void {
    this.service.listar(this.parametros.gateway).subscribe((lista: any) => {
      this.lista = lista
    })
  }

}
