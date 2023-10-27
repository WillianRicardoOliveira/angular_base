import { Component, OnInit } from '@angular/core';
import { Fornecedor } from '../fornecedor';
import { BaseService } from '@services/base/base.service';

@Component({
  selector: 'app-listar-fornecedor',
  templateUrl: './listar-fornecedor.component.html',
  styleUrls: ['./listar-fornecedor.component.scss']
})
export class ListarFornecedorComponent implements OnInit {

  lista: Fornecedor[] = []

  parametros = {
    rota_criar: "/criar-fornecedor",
    rota_editar: "/editar-fornecedor",
    rota_listar: "/listar-fornecedor",
    gateway: "fornecedor"
  }

  constructor(private service: BaseService) {}

  ngOnInit(): void {
    this.service.listar(this.parametros.gateway).subscribe((lista: any) => {
      this.lista = lista
    })
  }

}
