import { triggerDestaque } from '@/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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

  constructor() {}

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
