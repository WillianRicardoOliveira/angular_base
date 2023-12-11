import { Movimentacao } from '@/interfaces/interfaces';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseService } from '@services/base/base.service';

@Component({
  selector: 'app-movimentacao',
  templateUrl: './movimentacao.component.html',
  styleUrls: ['./movimentacao.component.scss']
})
export class MovimentacaoComponent implements OnInit {

  formulario!: FormGroup

  pagina: string = "Movimentação"

  isLista = true

  isFormulario = false

  endPoint = "movimentacao"
  
  lista: Movimentacao[] = []

  coluna = ["Tipo", "Produto", "Quantidade", "Total", "Data"]

  totalRegistros: number

  constructor(
    private service: BaseService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarLista()
  }

  carregarLista(page?: number, size?: number, sort?: string, filtro?: string) {
    this.service.listar(this.endPoint, page, size, sort, filtro).subscribe((lista: any) => {
      this.lista = lista.content
      this.totalRegistros = lista.totalElements
    })
  }

  carregarFormulario(id?: number) {
    this.isLista = false
    this.isFormulario = true
    if(id != null) {
      this.service.detalhar(this.endPoint, id).subscribe((dados) => {
        this.formulario = this.campos(dados)
      })
    } else {
      this.formulario = this.campos()
    } 
  }

  campos(dados?: Movimentacao) {
    return this.formBuilder.group({
      id: [(dados != null ? dados.id : "")],
      descricao: [(dados != null ? dados.tipo_movimentacao : ""), Validators.compose([
        Validators.required
      ])]
    })   
  }
      
  salvar() {
    this.service.salvar(this.endPoint, this.formulario)
    this.isFormulario = false
    this.isLista = true
  }

  cancelar() {
    this.isFormulario = false
    this.isLista = true    
  }

  botaoAdicionar() {
    this.carregarFormulario()
  }

  botaoEditar(id: number) {
    this.carregarFormulario(id)
  }

  botaoExcluir(id: number) {
    this.service.inativar(this.endPoint, id)
  }

  botaoVisualizar(id: number) { }

  pesquisar(filtro: string) { }

 

  quantidadePorPagina(parametros: {"page", "size"}) {
    this.carregarLista(parametros.page, parametros.size)
    this.router.routeReuseStrategy.shouldReuseRoute = () => false
    this.router.onSameUrlNavigation = "reload"
  }

}
