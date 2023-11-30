
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { BaseService } from '@services/base/base.service';
import { Observable, map, startWith } from 'rxjs';
@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {

  @Input() label: string;

  @Input() endPoint: string;

  @Input() control: FormControl;
  
  @Output() id: EventEmitter<any> = new EventEmitter<any>()
  
  dados: any[] = [];

  filteredOptions$?: Observable<any[]>;

  constructor(private service: BaseService) {}

  ngOnInit(): void {
    this.service.listar(this.endPoint).subscribe((lista: any) => {
        this.dados = lista.content
    })
    this.filteredOptions$ = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this.filtrar(value))
    )
  }

  filtrar(value: any): any[] {
    const nome = typeof value === "string" ? value : value?.nome
    const valorFiltrado = nome?.toLowerCase();
    const result = this.dados.filter(
      dado => dado.nome.toLowerCase().includes(valorFiltrado) 
    )
    return result
  }

  displayFn(dado: any): string {
    return dado && dado.nome ? dado.nome : ""
  }

  onOpcaoSelecionada(event: MatAutocompleteSelectedEvent): void {
    this.id.emit({"nome": this.endPoint, "id": event.option.value.id})
  }

}
