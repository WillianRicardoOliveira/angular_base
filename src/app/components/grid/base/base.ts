import { Directive, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
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

  constructor(    

    private service: BaseService,

    private formBuilder: FormBuilder,

    private router: Router,

    private route: ActivatedRoute

  ) {

    this.builder = formBuilder

  }

  ngOnInit(): void {

    this.id = this.route.snapshot.paramMap.get('id')

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

  campos(dados?: any): FormGroup {

    return this.formBuilder.group({})

  }

  salvar() {

    console.log("FORM ::: ", this.formulario.value)

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

  botaoVisualizar(id: number) {

  }

  pesquisar(filtro: string) {

  }

  botaoChamar(id: number) {
    this.router.navigate([this.chamar + "/" + id])
  }

  quantidadePorPagina(parametros: {"page", "size"}) {

    this.carregarLista(parametros.page, parametros.size)

    this.atualizaGrid()

  }

  atualizaGrid() {

    this.router.routeReuseStrategy.shouldReuseRoute = () => false

    this.router.onSameUrlNavigation = "reload"

  }

}