import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
    standalone: false
})
export class GridComponent implements OnInit {

  filtro: string

  objectKeys = Object.keys

  @Input() formatarComoMoeda: any

  @Input() totalRegistros: number

  @Input() lista: any

  @Input() coluna: any

  @Input() b_adicionar = true;

  @Input() textoAdicionar = 'Adicionar';

  @Input() b_chamar: boolean = false;

  @Input() iconeChamar = 'list_alt_add';

  @Input() tooltipChamar = 'Abrir opções';

  @Input() b_editar: boolean = true;

  @Input() b_excluir: boolean = true;

  @Input() b_visualizar: boolean = false;

  @Input() b_alterar_senha = false;

  @Input() b_pesquisa = true;

  @Input() b_paginacao = true;

  @Output() adicionar: EventEmitter<any> = new EventEmitter<any>();

  @Output() editar: EventEmitter<any> = new EventEmitter<any>();

  @Output() excluir: EventEmitter<any> = new EventEmitter<any>();

  @Output() visualizar: EventEmitter<any> = new EventEmitter<any>();

  @Output() alterarSenha: EventEmitter<number> = new EventEmitter<number>();

  @Output() pesquisa: EventEmitter<any> = new EventEmitter<any>();

  @Output() chamar: EventEmitter<any> = new EventEmitter<any>();

  @Output() p_paginacao: EventEmitter<any> = new EventEmitter<any>();

  constructor(private intl: MatPaginatorIntl) {}

  ngOnInit(): void {
    this.intl.itemsPerPageLabel = 'Itens por página';
    this.intl.previousPageLabel = "Página anterior"
    this.intl.nextPageLabel = "Próxima página"
    this.intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
      }
      length = Math.max(length, 0)
      const startIndex = page * pageSize
      if (startIndex >= length) {
        return `0 de ${length}`
      }
      const endIndex = Math.min(startIndex + pageSize, length)
      return `${startIndex + 1} - ${endIndex} de ${length}`
    }
  }

  botaoAdicionar() {
    this.adicionar.emit()
  }

  botaoEditar(id: number) {
    this.editar.emit(id)
  }

  botaoExcluir(id: number) {
    this.excluir.emit(id)
  }

  botaoVisualizar(id: number) {
    this.visualizar.emit(id)
  }

  botaoAlterarSenha(id: number): void {
    this.alterarSenha.emit(id);
  }

  pesquisar() {
    this.pesquisa.emit(this.filtro)
  }

  botaoChamar(id: number) {
    this.chamar.emit(id)
  }

  quantidadePorPagina(e: PageEvent) {
    this.p_paginacao.emit({"page": e.pageIndex, "size": e.pageSize})
  }

  ehStatus(
      valor: unknown
  ): boolean {
      if (typeof valor !== 'string') {
          return false;
      }

      return [
          'ATIVO',
          'INATIVO',
          'REMOVIDO'
      ].includes(
          valor.toUpperCase()
      );
  }

  classeStatus(
      valor: unknown
  ): string {
      if (!this.ehStatus(valor)) {
          return '';
      }

      return (
          'grid-status--' +
          String(valor).toLowerCase()
      );
  }

  textoStatus(
      valor: unknown
  ): string {
      if (!this.ehStatus(valor)) {
          return String(valor ?? '');
      }

      const texto =
          String(valor).toLowerCase();

      return (
          texto.charAt(0).toUpperCase() +
          texto.slice(1)
      );
  }

  deveFormatarComoMoeda(campo: any): boolean {
    let formatar = false
    if(this.formatarComoMoeda != null) {
      this.formatarComoMoeda.forEach((formata: any) => {
        if(formata == campo) {
          formatar = true
        }
      });
    }
    return formatar;
  }

}
