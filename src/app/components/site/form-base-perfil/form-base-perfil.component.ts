import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormValidations } from '@components/form-validations';
import { CadastroService } from '@services/site/cadastro/cadastro.service';

@Component({
  selector: 'app-form-base-perfil',
  templateUrl: './form-base-perfil.component.html',
  styleUrls: ['./form-base-perfil.component.scss']
})
export class FormBasePerfilComponent implements OnInit {
  
  cadastroForm!: FormGroup;
  
  //estadoControl = new FormControl<Estado | null>(null, Validators.required);

  @Input() perfilComponent = false
  @Input() titulo: string = "Crie sua conta"
  @Input() textoBotao: string = "Cadastrar"

  @Output() acaoClique: EventEmitter<any> = new EventEmitter<any>()
  @Output() sair: EventEmitter<any> = new EventEmitter<any>()
  @Output() buscar: EventEmitter<any> = new EventEmitter<any>()

  constructor(
    private formBuilder: FormBuilder,
    private service: CadastroService
    ) {}

  ngOnInit() {
    this.cadastroForm = this.formBuilder.group({
      nome: [null, Validators.required],
      nascimento: [null, [Validators.required]],
      genero: ['outro'],
      cpf: [null, [Validators.required]],
      telefone: [null, Validators.required],

      cep: [null, Validators.required],
      logradouro: [null, Validators.required],
      complemento: [null],
      bairro: [null, Validators.required],
      //estado: this.estadoControl,
      localidade: [null, Validators.required],
      uf: [null, Validators.required],
      numero: [null, Validators.required],
      
      email: [null, [Validators.required, Validators.email]],
      senha: [null, [Validators.required, Validators.minLength(3)]],
      confirmarEmail: [null, [Validators.required, Validators.email, FormValidations.equalTo('email')]],
      confirmarSenha: [null, [Validators.required, Validators.minLength(3), FormValidations.equalTo('senha')]],
      aceitarTermos: [null, [Validators.requiredTrue]]
    });
    if(this.perfilComponent){
      this.cadastroForm.get("aceitarTermos").setValidators(null)
    } else {
      this.cadastroForm.get("aceitarTermos").setValidators([Validators.requiredTrue])
    }
    this.cadastroForm.get("aceitarTermos").updateValueAndValidity()
    this.service.setCadastro(this.cadastroForm)
  }

  executarAcao() {
    this.acaoClique.emit()
  }

  deslogar() {
    this.sair.emit()
  }

  buscaDadosEndereco() {
    this.buscar.emit()
  }

}
