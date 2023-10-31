import { PessoaUsuario } from '@/interfaces/interfaces';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CadastroService } from '@services/site/cadastro/cadastro.service';

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

      delete formCadastro.get("usuario").value.confirmarEmail
      delete formCadastro.get("usuario").value.confirmarSenha
      
      //const novoCadastro = formCadastro.getRawValue() as PessoaUsuario
      
      const novoCadastro = formCadastro.value as PessoaUsuario
      
      //console.log("CADASTRO COMPONENT :: ", teste)
      //delete novoCadastro.usuario.confirmarEmail;
     // delete usuario.confirmarSenha; 
      

     
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
