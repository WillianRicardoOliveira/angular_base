import { Produto } from '@/interfaces/interfaces';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseService } from '@services/base/base.service';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss']
})
export class ProdutoComponent implements OnInit {

  formulario!: FormGroup

  pagina: string = "Produto"

  isLista = true

  isFormulario = false

  endPoint = "produto"
  
  lista: Produto[] = []

  coluna = ["Nome", "Descricao", "Quantidade", "Minimo", "Maximo"]

  constructor(
    private service: BaseService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.service.listar(this.endPoint).subscribe((lista: any) => {
      this.lista = lista.content
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

  campos(dados?: Produto) {
    return this.formBuilder.group({
      id: [(dados != null ? dados.id : "")],
      nome: [(dados != null ? dados.nome : ""), Validators.compose([
        Validators.required,
        Validators.pattern(/(.|\s)*\S(.|\s)*/),
        Validators.minLength(3),
        Validators.maxLength(100)
      ])],
      descricao: [(dados != null ? dados.descricao : ""), Validators.compose([Validators.maxLength(250)])],
      minimo: [(dados != null ? dados.minimo : ""), Validators.compose([Validators.required])],
      maximo: [(dados != null ? dados.maximo : ""), Validators.compose([Validators.required])]    
    })   
  }
      
  salvar() {
    this.service.salvar(this.endPoint, this.formulario)
    this.isFormulario = false
    this.isLista = true
    this.router.routeReuseStrategy.shouldReuseRoute = () => false
    this.router.onSameUrlNavigation = "reload"
    this.router.navigate([this.router.url])
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

}
