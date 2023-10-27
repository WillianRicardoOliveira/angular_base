import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseService } from '@services/base/base.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-criar-produto',
  templateUrl: './criar-produto.component.html',
  styleUrls: ['./criar-produto.component.scss']
})
export class CriarProdutoComponent implements OnInit {

  formulario!: FormGroup

  parametros = {
    rota_criar: "",
    rota_editar: "",
    rota_listar: "/listar-produto",
    gateway: "produto"
  }

  constructor(
    private service: BaseService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      nome: ['', Validators.compose([
        Validators.required,
        Validators.pattern(/(.|\s)*\S(.|\s)*/),
        Validators.minLength(3)
      ])]
    })
  }

  criar() {
    if(this.formulario.valid) {  
      this.service.cadastrar(this.parametros.gateway, this.formulario.value).subscribe(() => {
        this.router.navigate([this.parametros.rota_listar])
        this.toastr.success('Salvo com successo');
      })
    }
  }

  cancelar() {
    this.router.navigate([this.parametros.rota_listar])
  }

}
