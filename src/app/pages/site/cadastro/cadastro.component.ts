import { PessoaUsuario } from '@/interfaces/interfaces';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '@services/base/base.service';
import { CadastroService } from '@services/site/cadastro/cadastro.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent {

  perfilComponent = false

  constructor(
    private service: CadastroService,    
    private baseService: BaseService,
    private router: Router
    ) {}

  cadastrar() {
    const formCadastro = this.service.getCadastro()
    if(formCadastro?.valid) {
      const novoCadastro = formCadastro.getRawValue() as PessoaUsuario
     
     console.log("CADASTRO DE PESSOA :: ", novoCadastro)
     
      this.baseService.cadastrar("pessoa", novoCadastro)
      .subscribe({
        next: (value) => {
          this.router.navigate(["/login"])
        },
        error: (err) => {
          
        }
      })
    }  
  }

}
