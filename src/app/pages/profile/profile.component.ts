import {Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseService } from '@services/base/base.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

    formulario!: FormGroup

    rota = {
      rota_criar: "",
      rota_editar: "",
      rota_listar: "/listar-fornecedor",
      gateway: "fornecedor"
    }
    pagina: string = "Profile"
    
    constructor(
        private service: BaseService,
        private router: Router,
        private formBuilder: FormBuilder,
        private toastr: ToastrService
      ) {}
    
      ngOnInit(): void {
        this.formulario = this.formBuilder.group({
            nome: [null, Validators.required],
            nascimento: [null, [Validators.required]],
            cpf: [null, [Validators.required]],
            cidade: [null, Validators.required],
            email: [null, [Validators.required, Validators.email]],
            senha: [null, [Validators.required, Validators.minLength(3)]],
            //genero: ['outro'],
            telefone: [null, Validators.required],
          //  estado: this.estadoControl,
            confirmarEmail: [null, [Validators.required, Validators.email]],
            confirmarSenha: [null, [Validators.required, Validators.minLength(3)]],
            aceitarTermos: [null, [Validators.requiredTrue]]
      
        })
      }
    
      criar() {
        if(this.formulario.valid) {  
          this.service.cadastrar(this.rota.gateway, this.formulario.value).subscribe(() => {
            this.router.navigate([this.rota.rota_listar])
            this.toastr.success('Salvo com successo');
          })
        }
      }
    
      cancelar() {
        this.router.navigate([this.rota.rota_listar])
      }

}
