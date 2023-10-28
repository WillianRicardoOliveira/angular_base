import { PessoaUsuario } from '@/interfaces/interfaces';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseService } from '@services/base/base.service';
import { CadastroService } from '@services/site/cadastro/cadastro.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent {

  perfilComponent = false

  form: FormGroup | null

  constructor(
    private service: CadastroService,    
    private router: Router
    ) {}

  cadastrar() {
    const formCadastro = this.service.getCadastro()
   
    if(formCadastro?.valid) {

      const novoCadastro = formCadastro.getRawValue() as PessoaUsuario
 
      console.log("CADASTRO COMPONENT :: ", novoCadastro.usuario)
     
      this.service.cadastrar(novoCadastro)
      .subscribe({
        next: (value) => {
          this.router.navigate(["/login"])
        },
        error: (err) => {
          
        }
      })
    }  
  }

  buscaDadosEndereco() {
    this.form = this.service.getCadastro()

    this.service.buscaDadosEndereco(this.form?.value.endereco.cep).subscribe(endereco => {
      
      this.form.get('endereco').patchValue({
          cep: endereco.cep,
          logradouro: endereco.logradouro,
          complemento: endereco.complemento,
          bairro: endereco.bairro,
          localidade: endereco.localidade,
          uf: endereco.uf
      })
    })
  }

}
