import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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

  param = {
    end_point : "fornecedor",
    redireciona_salvar: "listar-fornecedor",
    redireciona_cancelar: "listar-fornecedor"
  }

  constructor(
    private service: BaseService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
    if(id != null) {
        this.service.detalhar(this.param.end_point, parseInt(id!)).subscribe((dados) => {
        this.formulario = this.campos(dados)
      })
    } else {
      this.formulario = this.campos("")
    }   
  }

  campos(dados: any) {
    return this.formBuilder.group({
      id: [(dados != "" ? dados.id : "")],
      cnpj: [(dados != "" ? dados.cnpj : ""), Validators.compose([Validators.required])],
      nome: [(dados != "" ? dados.nome : ""), Validators.compose([
        Validators.required,
        Validators.pattern(/(.|\s)*\S(.|\s)*/),
        Validators.minLength(3)
      ])],
      telefone: [(dados != "" ? dados.telefone : ""), Validators.compose([Validators.required])],
      descricao: [(dados != "" ? dados.descricao : "")]
    })   
  }
      
  salvar() {
    this.service.salvar(this.param.end_point, this.param.redireciona_salvar, this.formulario)
  }

  cancelar() {
    this.service.cancelar(this.param.redireciona_cancelar)
  }

}
