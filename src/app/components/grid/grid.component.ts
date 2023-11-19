import { triggerDestaque } from '@/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '@services/base/base.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],

  animations: [triggerDestaque]

})
export class GridComponent implements OnInit {

  @Input() lista: any

  @Input() coluna: any

  @Output() adicionar: EventEmitter<any> = new EventEmitter<any>()

  @Output() editar: EventEmitter<any> = new EventEmitter<any>()

  @Output() excluir: EventEmitter<any> = new EventEmitter<any>()

  objectKeys = Object.keys

  indexTarefa = -1

  constructor(
    private service: BaseService,
    private router: Router,
    private toastr: ToastrService
    ) {}

  ngOnInit(): void {}

 

  botaoAdicionar() {
    this.adicionar.emit()
  }

  botaoEditar(id: number) {
    this.editar.emit(id)
  }

  botaoExcluir(id: number) {
    this.excluir.emit(id)
  }

}
