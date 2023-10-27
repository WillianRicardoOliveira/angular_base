import { BaseService } from '@services/base/base.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-formulario-validacao',
  templateUrl: './formulario-validacao.component.html',
  styleUrls: ['./formulario-validacao.component.scss']
})
export class FormularioValidacaoComponent implements OnInit {

  @Input() formulario!: FormGroup

  constructor(

    private service: BaseService

  ) {}

  ngOnInit(): void {

  }

}
