
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EstadoService } from '@services/site/estado/estado.service';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-dropdown-uf',
  templateUrl: './dropdown-uf.component.html',
  styleUrls: ['./dropdown-uf.component.scss']
})
export class DropdownUfComponent implements OnInit {
  @Input() label: string = '';
  @Input() iconePrefixo: string = '';
  @Input() placeholder: string = '';
  @Input() control!: FormControl;

  ngOnInit(): void {}
  /*
  estados: Estado[] = [];

  filteredOptions$?: Observable<Estado[]>;


  constructor(
    private estado: EstadoService) {

  }

  ngOnInit(): void {
    this.estado.listar()
      .subscribe(dados => {
        this.estados = dados
        //console.log(this.unidadesFederativas)
      })
    this.filteredOptions$ = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this.filtrarUfs(value))
    )
  }

  filtrarUfs(value: string | Estado): Estado[] {
    
    const nomeUf = typeof value === "string" ? value : value?.nome
    
    const valorFiltrado = nomeUf?.toLowerCase();
    const result = this.estados.filter(
      estado => estado.nome.toLowerCase().includes(valorFiltrado)
    )
    return result
  }

  displayFn(estado: Estado): string {
    return estado && estado.nome ? estado.nome : ""
  }
*/
}
