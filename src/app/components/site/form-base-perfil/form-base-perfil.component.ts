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
      nome: ["Willian Ricardo Oliveira", Validators.required],
      nascimento: ["12/02/1990", [Validators.required]],
      genero: ['Outro'],
      cpf: ["064.883.839-06", [Validators.required]],
      telefone: ["(41)98875-5471", Validators.required],

      endereco: this.formBuilder.group({
        cep: ["82720000", Validators.required],
        logradouro: ["Estrada Guilherme Weigert", Validators.required],
        complemento: ["AP 14 BL 42"],
        bairro: ["Santa Cândida", Validators.required],
        //estado: this.estadoControl,
        localidade: ["Curitiba", Validators.required],
        uf: ["PR", Validators.required],
        numero: ["2245", Validators.required]
      }),
      usuario: this.formBuilder.group({
        email: ["willian.vancouver@gmail.com", [Validators.required, Validators.email]],
        senha: ["123456", [Validators.required, Validators.minLength(3)]],
        confirmarEmail: ["willian.vancouver@gmail.com", [Validators.required, Validators.email, FormValidations.equalTo('usuario.email')]],
        confirmarSenha: ["123456", [Validators.required, Validators.minLength(3), FormValidations.equalTo('usuario.senha')]]
      }),
      aceitarTermos: [true, [Validators.requiredTrue]],
      tipoPessoa: ["CLIENTE"]
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
