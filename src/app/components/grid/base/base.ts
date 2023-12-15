import { Fornecedor, Produto, TipoMovimentacao } from "@/interfaces/interfaces";
import { Directive, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseService } from "@services/base/base.service";

@Directive({
  selector: 'app-base-grid'
})
export class Base implements OnInit {

  formulario!: FormGroup
  lista: any[] = []
  isLista = true
  isFormulario = false
  endPoint: string
  totalRegistros: number
  builder: FormBuilder
  id: String
  chamar: String
  tipoMovimentacaoControl = new FormControl<TipoMovimentacao | null>(null, Validators.required)  
  fornecedorControl = new FormControl<Fornecedor | null>(null, Validators.required)
  produtoControl = new FormControl<Produto | null>(null, Validators.required)

  constructor(    
    private service: BaseService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.builder = formBuilder
  }

  /*
   * Todo :
   */
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')
    this.carregarLista()
  }

  /*
   * Todo :
   */
  carregarLista(page?: number, size?: number, sort?: string, filtro?: string) {
    this.service.listar(this.endPoint, page, size, sort, filtro).subscribe((lista: any) => {
      this.lista = lista.content
      this.totalRegistros = lista.totalElements
      this.atualizaGrid()
    })
  }

  /*
   * Todo :
   */
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

  /*
   * Todo :
   */
  campos(dados?: any): FormGroup {
    return this.formBuilder.group({})
  }

  /*
   * Todo :
   */
  salvar() {
    this.service.salvar(this.endPoint, this.formulario)
    this.carregarLista()
    this.isFormulario = false
    this.isLista = true
  }

  /*
   * Todo :
   */
  cancelar() {
    this.isFormulario = false
    this.isLista = true
  }

  /*
   * Todo :
   */
  botaoAdicionar() {
    this.carregarFormulario()
  }

  /*
   * Todo :
   */
  botaoEditar(id: number) {
    this.carregarFormulario(id)
  }

  /*
   * Todo :
   */
  botaoExcluir(id: number) {
    this.service.inativar(this.endPoint, id)
  }

  /*
   * Todo :
   */
  botaoVisualizar(id: number) {

  }

  /*
   * Todo :
   */
  pesquisar(filtro: string) {

  }

  /*
   * Todo :
   */
  botaoChamar(id: number) {
    this.router.navigate([this.chamar + "/" + id])
  }

  /*
   * Todo :
   */
  quantidadePorPagina(parametros: {"page", "size"}) {
    this.carregarLista(parametros.page, parametros.size)
  }

  /*
   * Todo :
   */
  atualizaGrid() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false
    this.router.onSameUrlNavigation = "reload"
  }

  /*
   * Todo :
   */
  tipoMovimentacaoChange() {
    this.formulario.patchValue({ "tipoMovimentacao": this.tipoMovimentacaoControl.value })
  }

  /*
   * Todo :
   */
  fornecedorChange() {
    this.formulario.patchValue({ "fornecedor": this.fornecedorControl.value })
  }

  /*
   * Todo :
  */   
  produtoChange() {
    this.formulario.patchValue({ "produto": this.produtoControl.value })
  }

}