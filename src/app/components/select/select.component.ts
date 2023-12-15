import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BaseService } from '@services/base/base.service';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {
  
  @Input() control: FormControl

  @Input() point: string
    
  @Output() objeto = new EventEmitter<string>()
  
  dados: any[] = [];
  
  selected: any

  constructor(private service: BaseService) {}

  ngOnInit(): void {
    this.service.listar(this.point).subscribe((lista: any) => {
      this.dados = lista.content
      if(this.control.value){
        this.selected = this.dados.find(tipo => tipo.id === this.control.value.id)
      }
    })
  }

  onMatSelectChange(event: any) {
    this.control.setValue(event.value);
    this.objeto.emit()
  }

}
