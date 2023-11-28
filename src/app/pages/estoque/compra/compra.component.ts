import { Compra } from '@/interfaces/interfaces';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseService } from '@services/base/base.service';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.scss']
})
export class CompraComponent implements OnInit {

  formulario!: FormGroup

  pagina: string = "Compra"

  isLista = true

  isFormulario = false

  endPoint = "compra"
  
  lista: Compra[] = []

  coluna = ["Descrição", "Status"]

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

  campos(dados?: Compra) {
    return this.formBuilder.group({
      id: [(dados != null ? dados.id : "")],
      descricao: [(dados != null ? dados.descricao : ""), Validators.compose([
        Validators.required,
        Validators.maxLength(250)
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

}