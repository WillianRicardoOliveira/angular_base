
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

  @Input() control: FormControl

  @Input() point: string

  dados: any[] = [];

  filteredOptions$?: Observable<any[]>;

  @Output() objeto = new EventEmitter<string>()

  constructor(private service: BaseService) {}

  ngOnInit(): void {
    this.service.listar(this.point).subscribe((lista: any) => {
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

  onAutocompleteChange(event: MatAutocompleteSelectedEvent) {
    this.control.setValue(event.option.value);
    this.objeto.emit()
  }

}
