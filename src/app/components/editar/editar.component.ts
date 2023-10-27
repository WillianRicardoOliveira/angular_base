import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '@services/base/base.service';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarComponent implements OnInit {

  @Input() param: any

  @Input() dado: any

  constructor(

    private service: BaseService,

    private router: Router,

  ) {}

  ngOnInit(): void {

    this.router.navigate([this.param.rotaEditar/this.dado.id])

  }

}
