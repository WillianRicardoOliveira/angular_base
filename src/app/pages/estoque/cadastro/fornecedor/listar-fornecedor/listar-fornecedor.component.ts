import { Fornecedor } from '@/interfaces/interfaces';
import { Component, OnInit } from '@angular/core';
import { BaseService } from '@services/base/base.service';

@Component({
  selector: 'app-listar-fornecedor',
  templateUrl: './listar-fornecedor.component.html',
  styleUrls: ['./listar-fornecedor.component.scss']
})
export class ListarFornecedorComponent implements OnInit {

  lista: Fornecedor[] = []

  coluna: any = ["Código", "CNPJ", "Nome", "Telefone"]

  rota = {
    criar: "/criar-fornecedor",
    editar: "/criar-fornecedor",
    listar: "/listar-fornecedor",
    gateway: "fornecedor"
  }



  pagina: string = "Fornecedor"

  constructor(private service: BaseService) {}

  ngOnInit(): void {
    this.service.listar("fornecedor").subscribe((lista: any) => {
      this.lista = lista.content
    })
  }

}
