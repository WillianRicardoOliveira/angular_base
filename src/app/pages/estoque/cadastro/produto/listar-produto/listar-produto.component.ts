import { Produto } from '@/interfaces/interfaces';
import { Component, OnInit } from '@angular/core';
import { BaseService } from '@services/base/base.service';

@Component({
  selector: 'app-listar-produto',
  templateUrl: './listar-produto.component.html',
  styleUrls: ['./listar-produto.component.scss']
})
export class ListarProdutoComponent implements OnInit {

  lista: Produto[] = []

  coluna: any = ["Id"]

  rota = {
    rota_criar: "/criar-produto",
    rota_editar: "/editar-produto",
    rota_listar: "/listar-produto"
    
  }

  constructor(private service: BaseService) {}

  ngOnInit(): void {
    this.service.listar("produto").subscribe((lista: any) => {
      this.lista = lista
    })
  }

}
