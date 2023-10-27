import { Component, OnInit } from '@angular/core';
import { BaseService } from '@services/base/base.service';
import { Produto } from '../produto';

@Component({
  selector: 'app-listar-produto',
  templateUrl: './listar-produto.component.html',
  styleUrls: ['./listar-produto.component.scss']
})
export class ListarProdutoComponent implements OnInit {

  lista: Produto[] = []

  parametros = {
    rota_criar: "/criar-produto",
    rota_editar: "/editar-produto",
    rota_listar: "/listar-produto",
    gateway: "produto"
  }

  constructor(private service: BaseService) {}

  ngOnInit(): void {
    this.service.listar(this.parametros.gateway).subscribe((lista: any) => {
      this.lista = lista
    })
  }

}
