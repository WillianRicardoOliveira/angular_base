import { Fornecedor, Produto, TipoMovimentacao } from "@/interfaces/interfaces";
import { Directive, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseService } from "@services/base/base.service";
import { ToastrService } from "ngx-toastr";

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
  outroId: number
  chamar: String
  tipoMovimentacaoControl = new FormControl<TipoMovimentacao | null>(null, Validators.required)  
  fornecedorControl = new FormControl<Fornecedor | null>(null, Validators.required)
  produtoControl = new FormControl<Produto | null>(null, Validators.required)

  constructor(    
    private service: BaseService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.builder = formBuilder
  }

  /*
   * Todo : PASSAR O ID SE EXISTIR
   */
  ngOnInit(): void {
    this.outroId = parseInt(this.route.snapshot.paramMap.get('id'))
    this.carregarLista()
  }

  /*
   * Todo : Colocar o NEXT
   */
  carregarLista(page?: number, size?: number, sort?: string, filtro?: string) {
    this.service.listar(this.endPoint, page, size, sort, filtro, this.outroId).subscribe((lista: any) => {
      this.lista = lista.content
      this.totalRegistros = lista.totalElements
      this.atualizaGrid()
    })
  }

  /*
   * Todo : Colocar o NEXT
   */
  carregarFormulario(id?: number) {
    this.resetForm()
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
    this.service.salvar(this.endPoint, this.formulario).subscribe({
      next: (value) => {
        this.isFormulario = false
        this.isLista = true
        this.carregarLista()
        this.resetForm()
        this.toastr.success('Salvo com successo');
      },
      error: (err) => {
        this.toastr.error('Não foi possível salvar');
      }
    })    
  }

  /*
   * Todo :
   */
  cancelar() {
    this.isFormulario = false
    this.isLista = true
    this.resetForm()
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
    this.service.inativar(this.endPoint, id).subscribe({
      next: (value) => {        
        this.carregarLista()        
        this.toastr.info('Removido com successo');
      },
      error: (err) => {
        this.toastr.error('Não foi possível remover');
      }
    })
  }

  /*
   * Todo :
   */
  botaoVisualizar(id: number) {

  }

  /*
   * Todo : Carregra se tiver 3 letras ou apagar as letras
   */
  pesquisar(filtro: string) {

    console.log("filtro ::: ", filtro)

    this.carregarLista(null, null, null, filtro)

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

  resetForm() {
    if(this.formulario) {
      this.formulario.reset()
      this.tipoMovimentacaoControl.reset()
      this.fornecedorControl.reset()
      this.produtoControl.reset()
    }
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