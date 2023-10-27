import { PessoaUsuario } from '@/interfaces/interfaces';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CadastroService } from '@services/site/cadastro/cadastro.service';
import { TokenService } from '@services/token/token.service';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  titulo = "Olá, "
  textoBotao = "Atualizar"
  perfilComponent = true

  id: number
  nome: string
  cadastro!: PessoaUsuario
  form: FormGroup | null

  constructor(
    private userService: UserService,
    private cadastroService: CadastroService,
    private router: Router
    ) {}
  
  ngOnInit(): void {
    this.userService.retornarUser().subscribe(pessoa => {
      this.id = pessoa.id
      this.cadastroService.detalhar(pessoa.id).subscribe(cadastro => {
        this.cadastro = cadastro
        this.nome = cadastro.nome
        this.carregarFormulario()
      })  
    })
    
  }

  carregarFormulario() {

    console.log("CADSTRO ::: ", this.cadastro)


    this.form = this.cadastroService.getCadastro()
    this.form?.patchValue({
        nome: this.cadastro.nome,
        nascimento: this.cadastro.nascimento,
        genero: this.cadastro.genero,
        cpf: this.cadastro.cpf,
        telefone: this.cadastro.telefone,

        cep: this.cadastro.endereco.cep,
        logradouro: this.cadastro.endereco.logradouro,
        complemento: this.cadastro.endereco.complemento,
        bairro: this.cadastro.endereco.bairro,
        localidade: this.cadastro.endereco.localidade,
        uf: this.cadastro.endereco.uf,
        numero: this.cadastro.endereco.numero
    })
  }

  atualizar() {
    const dadosAtualizados = {
      id: this.id,
      nome: this.form?.value.nome,
      nascimento: this.form?.value.nascimento,
      genero: this.form?.value.genero,
      cpf: this.form?.value.cpf,
      telefone: this.form?.value.telefone,
      
      cep: this.form?.value.cep,
      logradouro: this.form?.value.logradouro,
      complemento: this.form?.value.complemento,
      bairro: this.form?.value.bairro,
      localidade: this.form?.value.localidade,
      uf: this.form?.value.uf,
      numero: this.form?.value.numero
    }

    this.cadastroService.atualizar(dadosAtualizados).subscribe({
      next: (value) => {
        this.router.navigateByUrl("/")
      },
      error: (err) => {
      
      }
    })

  }

  deslogar() {
    this.userService.logout()
    this.router.navigate(["/login"])
  }

  buscaDadosEndereco() {
    this.cadastroService.buscaDadosEndereco(this.form?.value.cep).subscribe(endereco => {
      this.form = this.cadastroService.getCadastro()
      this.form?.patchValue({
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
