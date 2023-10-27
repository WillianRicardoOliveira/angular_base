import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from '@services/base/base.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-editar-fornecedor',
  templateUrl: './editar-fornecedor.component.html',
  styleUrls: ['./editar-fornecedor.component.scss']
})
export class EditarFornecedorComponent implements OnInit {

  formulario!: FormGroup

  parametros = {
    rota_criar: "/criar-fornecedor",
    rota_editar: "/editar-fornecedor",
    rota_listar: "/listar-fornecedor",
    gateway: "fornecedor"
  }

  constructor(
    private service: BaseService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
    this.service.detalhar(this.parametros.gateway, parseInt(id!)).subscribe((dados) => {
      this.formulario = this.formBuilder.group({
        id: [dados.id],
        nome: [dados.nome, Validators.compose([
          Validators.required,
          Validators.pattern(/(.|\s)*\S(.|\s)*/),
          Validators.minLength(3)
        ])]
      })
    })
  }

  editar() {
    if(this.formulario.valid) {
      this.service.atualizar(this.parametros.gateway, this.formulario.value).subscribe(() => {
        this.router.navigate([this.parametros.rota_listar])
        this.toastr.success('Salvo com successo');
      })
    }
  }

  cancelar() {
    this.router.navigate([this.parametros.rota_listar])
  }

}
