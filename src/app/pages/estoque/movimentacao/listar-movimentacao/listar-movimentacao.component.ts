import { Movimentacao } from '@/interfaces/interfaces';
import { Component, OnInit } from '@angular/core';
import { BaseService } from '@services/base/base.service';


@Component({
  selector: 'app-listar-movimentacao',
  templateUrl: './listar-movimentacao.component.html',
  styleUrls: ['./listar-movimentacao.component.scss']
})
export class ListarMovimentacaoComponent implements OnInit {

  lista: Movimentacao[] = []

  coluna: any = ["Id", "Nome",
    
    "Tipo",
    "Quantidade",
    "Total",
    "Data"
  ]

  rota = {
    cadastrar: "/criar-movimentacao",
    listar: "/editar-movimentacao",
    atualizar: "/listar-movimentacao",
    excluir: "",
    detalhar: ""
  }

  constructor(private service: BaseService) {}

  ngOnInit(): void {
    this.service.listar("movimentacao").subscribe((lista: any) => {
      this.lista = lista
    })
  }

}
