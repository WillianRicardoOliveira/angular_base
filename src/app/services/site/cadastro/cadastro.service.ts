import { PessoaUsuario } from '@/interfaces/interfaces';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseService } from '@services/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {

  cadastroForm: FormGroup | null = null 

  constructor(private service: BaseService) {}

  getCadastro(): FormGroup | null {
    return this.cadastroForm
  }

  setCadastro(form: FormGroup) {
    this.cadastroForm = form
  }

  cadastrar(pessoaUsuario: PessoaUsuario){
    return this.service.cadastrar("pessoa", pessoaUsuario)
  }

  atualizar(pessoaUsuario: any){
    return this.service.atualizar("pessoa", pessoaUsuario)
  }

  detalhar(id: number){
    return this.service.detalhar("pessoa", id)
  }

  buscaDadosEndereco(cep: number){
    return this.service.detalhar("endereco/buscar", cep)
  }
  
}
