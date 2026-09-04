import {
    CategoriaConta,
    FormaPagamento,
    Fornecedor,
    Produto,
    StatusPagamento,
    SubCategoriaConta,
    TipoMovimentacao
} from '@/interfaces/interfaces';

import {
    Directive,
    OnInit
} from '@angular/core';

import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';

import {
    ActivatedRoute,
    Router
} from '@angular/router';

import {
    BaseService
} from '@services/base/base.service';

import {
    ToastrService
} from 'ngx-toastr';

@Directive({
    selector: 'app-base-grid',
    standalone: false
})
export class Base implements OnInit {

    formulario!: FormGroup;

    lista: any[] = [];

    isLista = true;

    isFormulario = false;

    isVisualizacao = false;

    endPoint: string;

    totalRegistros: number;

    builder: FormBuilder;

    outroId: number;

    chamar: string;

    tipoMovimentacaoControl =
        new FormControl<TipoMovimentacao | null>(
            null,
            Validators.required
        );

    fornecedorControl =
        new FormControl<Fornecedor | null>(
            null,
            Validators.required
        );

    produtoControl =
        new FormControl<Produto | null>(
            null,
            Validators.required
        );

    categoriaContaControl =
        new FormControl<CategoriaConta | null>(
            null,
            Validators.required
        );

    subCategoriaContaControl =
        new FormControl<SubCategoriaConta | null>(
            null,
            Validators.required
        );

    statusPagamentoControl =
        new FormControl<StatusPagamento | null>(
            null,
            Validators.required
        );

    formaPagamentoControl =
        new FormControl<FormaPagamento | null>(
            null,
            Validators.required
        );

    constructor(
        private readonly service:
            BaseService,
        private readonly formBuilder:
            FormBuilder,
        private readonly router:
            Router,
        private readonly route:
            ActivatedRoute,
        private readonly toastr:
            ToastrService
    ) {
        this.builder =
            formBuilder;
    }

    ngOnInit(): void {
        this.outroId =
            Number.parseInt(
                this.route
                    .snapshot
                    .paramMap
                    .get('id') ?? '',
                10
            );

        this.carregarLista();
    }

    carregarLista(
        page?: number,
        size?: number,
        sort?: string,
        filtro?: string
    ): void {
        this.service
            .listar(
                this.endPoint,
                page,
                size,
                sort,
                filtro,
                this.outroId
            )
            .subscribe((lista: any) => {
                this.lista =
                    lista.content;

                this.totalRegistros =
                    lista.totalElements;

                this.atualizaGrid();
            });
    }

    carregarFormulario(
        id?: number
    ): void {
        this.resetForm();

        this.isLista = false;
        this.isFormulario = true;

        if (id != null) {
            this.service
                .detalhar(
                    this.endPoint,
                    id
                )
                .subscribe((dados) => {
                    this.formulario =
                        this.campos(
                            dados
                        );

                    if (this.isVisualizacao) {
                        this.formulario
                            .disable();
                    }
                });

            return;
        }

        this.formulario =
            this.campos();
    }

    campos(
        _dados?: any
    ): FormGroup {
        return this.formBuilder
            .group({});
    }

    salvar(): void {
        this.service
            .salvar(
                this.endPoint,
                this.formulario
            )
            .subscribe({
                next: (value) => {
                    this.toastr.success(
                        'Salvo com sucesso'
                    );

                    const fluxoPersonalizado =
                        this.aposSalvar(
                            value
                        );

                    if (fluxoPersonalizado) {
                        this.resetForm();

                        return;
                    }

                    this.isFormulario = false;
                    this.isLista = true;

                    this.carregarLista();
                    this.resetForm();
                },
                error: () => {
                    this.toastr.error(
                        'Não foi possível salvar'
                    );
                }
            });
    }

    protected aposSalvar(
        _value: unknown
    ): boolean {
        return false;
    }

    protected aposExcluir(
        _id: number
    ): boolean {
        return false;
    }

    cancelar(): void {
        this.isFormulario = false;
        this.isLista = true;
        this.isVisualizacao = false;

        this.resetForm();
    }

    botaoAdicionar(): void {
        this.isVisualizacao = false;

        this.carregarFormulario();
    }

    botaoEditar(
        id: number
    ): void {
        this.isVisualizacao = false;

        this.carregarFormulario(
            id
        );
    }

    botaoExcluir(
        id: number
    ): void {
        this.service
            .inativar(
                this.endPoint,
                id
            )
            .subscribe({
                next: () => {
                    this.toastr.info(
                        'Removido com sucesso'
                    );

                    const fluxoPersonalizado =
                        this.aposExcluir(
                            id
                        );

                    if (fluxoPersonalizado) {
                        return;
                    }

                    this.carregarLista();
                },
                error: () => {
                    this.toastr.error(
                        'Não foi possível remover'
                    );
                }
            });
    }

    botaoVisualizar(
        id: number
    ): void {
        this.isVisualizacao = true;

        this.carregarFormulario(
            id
        );
    }

    pesquisar(
        filtro: string
    ): void {
        this.carregarLista(
            undefined,
            undefined,
            undefined,
            filtro
        );
    }

    botaoChamar(
        id: number
    ): void {
        void this.router.navigate([
            `${this.chamar}/${id}`
        ]);
    }

    quantidadePorPagina(
        parametros: {
            page: number;
            size: number;
        }
    ): void {
        this.carregarLista(
            parametros.page,
            parametros.size
        );
    }

    atualizaGrid(): void {
        this.router
            .routeReuseStrategy
            .shouldReuseRoute =
            () => false;

        this.router
            .onSameUrlNavigation =
            'reload';
    }

    resetForm(): void {
        if (!this.formulario) {
            return;
        }

        this.formulario.reset();

        this.tipoMovimentacaoControl
            .reset();

        this.fornecedorControl
            .reset();

        this.produtoControl
            .reset();
    }

    tipoMovimentacaoChange(): void {
        this.formulario.patchValue({
            tipoMovimentacao:
                this.tipoMovimentacaoControl.value
        });
    }

    fornecedorChange(): void {
        this.formulario.patchValue({
            fornecedor:
                this.fornecedorControl.value
        });
    }

    produtoChange(): void {
        this.formulario.patchValue({
            produto:
                this.produtoControl.value
        });
    }

    categoriaContaChange(): void {
        this.formulario.patchValue({
            categoriaConta:
                this.categoriaContaControl.value
        });
    }

    subCategoriaContaChange(): void {
        this.formulario.patchValue({
            subCategoriaConta:
                this.subCategoriaContaControl.value
        });
    }

    statusPagamentoChange(): void {
        this.formulario.patchValue({
            statusPagamento:
                this.statusPagamentoControl.value
        });
    }

    formaPagamentoChange(): void {
        this.formulario.patchValue({
            formaPagamento:
                this.formaPagamentoControl.value
        });
    }
}