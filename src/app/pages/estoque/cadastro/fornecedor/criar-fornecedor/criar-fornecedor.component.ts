import { Fornecedor } from '@/interfaces/interfaces';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseService } from '@services/base/base.service';

@Component({
  selector: 'app-criar-fornecedor',
  templateUrl: './criar-fornecedor.component.html',
  styleUrls: ['./criar-fornecedor.component.scss']
})
export class CriarFornecedorComponent implements OnInit {

  formulario!: FormGroup

  pagina: string = "Fornecedor"

  isLista = true

  isFormulario = false

  endPoint = "fornecedor"
  
  lista: Fornecedor[] = []

  coluna = ["Código", "CNPJ", "Nome", "Telefone"]

  constructor(
    private service: BaseService,
    private formBuilder: FormBuilder
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

  campos(dados?: Fornecedor) {
    return this.formBuilder.group({
      id: [(dados != null ? dados.id : "")],
      cnpj: [(dados != null ? dados.cnpj : ""), Validators.compose([Validators.required])],
      nome: [(dados != null ? dados.nome : ""), Validators.compose([
        Validators.required,
        Validators.pattern(/(.|\s)*\S(.|\s)*/),
        Validators.minLength(3)
      ])],
      telefone: [(dados != null ? dados.telefone : ""), Validators.compose([Validators.required])],
      descricao: [(dados != null ? dados.descricao : "")]
    })   
  }
      
  salvar() {
    this.service.salvar(this.endPoint, this.formulario)
    this.isFormulario = false
    this.isLista = true

    // ATUALIZAR A LISTA

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

    // ATUALIZAR A LISTA

  }

}
