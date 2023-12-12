import { CompraItem, Fornecedor, Produto } from '@/interfaces/interfaces';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from '@services/base/base.service';

@Component({
  selector: 'app-compra-item',
  templateUrl: './compra-item.component.html',
  styleUrls: ['./compra-item.component.scss']
})
export class CompraItemComponent implements OnInit {

  formulario!: FormGroup

  pagina: string = "Intens da compra";

  isLista = true;

  isFormulario = false;

  endPoint = "compraItem";
  
  lista: CompraItem[] = []

  coluna = ["Fornecedor", "Produto", "Quantidade", "Valor", "Total"]

  totalRegistros: number

  compra: string
  formatarComoMoeda = ["valor", "total"]

  fornecedorControl = new FormControl<Fornecedor | null>(null, Validators.required);

  produtoControl = new FormControl<Produto | null>(null, Validators.required);

  constructor(
    private service: BaseService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.compra = this.route.snapshot.paramMap.get('id')
    this.carregarLista()
  }

  carregarLista(page?: number, size?: number, sort?: string, filtro?: string) {
    this.service.listar(this.endPoint, page, size, sort, filtro).subscribe((lista: any) => {
      this.lista = lista.content
      this.totalRegistros = lista.totalElements
    })
  }

  carregarFormulario(id?: number) {
    this.isLista = false
    this.isFormulario = true
    if(id != null) {
      this.service.detalhar(this.endPoint, id).subscribe((dados) => {
        this.formulario = this.campos(dados)
      })
    } else {
      this.formulario = this.campos()
    } 
  }

  campos(dados?: CompraItem) {
    return this.formBuilder.group({   
      id: [(dados != null ? dados.id : "")],
      compra: [this.compra, Validators.compose([Validators.required])],
      fornecedor: [(dados != null ? dados.fornecedor : ""), Validators.compose([Validators.required])],
      produto: [(dados != null ? dados.produto : ""), Validators.compose([Validators.required])],
      quantidade: [(dados != null ? dados.quantidade : ""), Validators.compose([Validators.required])],
      valor: [(dados != null ? dados.valor : ""), Validators.compose([ Validators.required])],
    })   
  }
      
  salvar() {
    console.log("teste", this.formulario.value)
    this.service.salvar(this.endPoint, this.formulario)
    this.isFormulario = false
    this.isLista = true
  }

  cancelar() {
    this.isFormulario = false
    this.isLista = true    
  }

  botaoAdicionar() {
    this.carregarFormulario()
  }

  botaoEditar(id: number) {
    this.carregarFormulario(id)
  }

  botaoExcluir(id: number) {
    this.service.inativar(this.endPoint, id)
  }

  botaoVisualizar(id: number) { }

  pesquisar(filtro: string) { }

  botaoChamar(id: number) {}  

  quantidadePorPagina(parametros: {"page", "size"}) {
    this.carregarLista(parametros.page, parametros.size)
    this.router.routeReuseStrategy.shouldReuseRoute = () => false
    this.router.onSameUrlNavigation = "reload"
  }

}
