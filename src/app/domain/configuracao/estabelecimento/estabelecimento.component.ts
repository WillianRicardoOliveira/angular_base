import {
    Component,
    DestroyRef,
    inject,
    OnInit
} from '@angular/core';

import {
    takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';

import {
    debounceTime,
    distinctUntilChanged,
    filter,
    skip
} from 'rxjs';

import {
    ToastrService
} from 'ngx-toastr';

import {
    ChavePermissao
} from '@/core/autorizacao/models/chave-permissao';

import {
    AutorizacaoService
} from '@/core/autorizacao/services/autorizacao.service';

import {
    ContextoOrganizacaoService
} from '@/core/organizacao/services/contexto-organizacao.service';

import {
    Empresa,
    Estabelecimento
} from '@/interfaces/interfaces';

import {
    ItemBreadcrumbPagina
} from '@components/cabecalho-pagina/cabecalho-pagina.component';

import {
    EstabelecimentoService
} from './services/estabelecimento.service';

@Component({
    selector: 'app-estabelecimento',
    templateUrl:
        './estabelecimento.component.html',
    styleUrls: [
        './estabelecimento.component.scss'
    ],
    standalone: false
})
export class EstabelecimentoComponent
    implements OnInit {

    private readonly service =
        inject(
            EstabelecimentoService
        );

    private readonly autorizacaoService =
        inject(
            AutorizacaoService
        );

    private readonly contextoOrganizacaoService =
        inject(
            ContextoOrganizacaoService
        );

    private readonly builder =
        inject(
            FormBuilder
        );

    private readonly toastr =
        inject(
            ToastrService
        );

    private readonly destroyRef =
        inject(
            DestroyRef
        );

    pagina = 'Estabelecimentos';

    descricao =
        'Gerencie os estabelecimentos das empresas';

    breadcrumb: ItemBreadcrumbPagina[] = [
        {
            titulo:
                'Configuracao'
        }
    ];

    coluna = [
        'Codigo da empresa',
        'Empresa',
        'Nome',
        'Status'
    ];

    lista:
        Estabelecimento[] = [];

    empresas:
        Empresa[] = [];

    totalRegistros = 0;

    isLista = true;

    isFormulario = false;

    isVisualizacao = false;

    formulario!: FormGroup;

    empresaPesquisaControl =
        new FormControl<
            string | Empresa | null
        >('');

    empresaNome = '';

    paginaAtual = 0;

    tamanhoPagina = 10;

    filtro = '';

    get podeCriar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .EstabelecimentoCriar
            );
    }

    get podeEditar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .EstabelecimentoEditar
            );
    }

    get podeExcluir(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .EstabelecimentoExcluir
            );
    }

    get podeDetalhar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .EstabelecimentoDetalhar
            );
    }

    get podeSalvar(): boolean {
        const possuiId =
            !!this.formulario
                ?.get('id')
                ?.value;

        return possuiId
            ? this.podeEditar
            : this.podeCriar;
    }

    get cadastrando(): boolean {
        return !this.formulario
            ?.get('id')
            ?.value;
    }

    ngOnInit(): void {
        this.configurarPesquisaDeEmpresa();
        this.configurarAtualizacaoPorOrganizacao();
        this.carregarLista();
    }

    carregarLista(
        page = this.paginaAtual,
        size = this.tamanhoPagina,
        filtro = this.filtro
    ): void {
        this.service
            .listar(
                page,
                size,
                'id,desc',
                filtro
            )
            .subscribe({
                next: (pagina) => {
                    this.lista =
                        pagina.content;

                    this.totalRegistros =
                        pagina.totalElements;

                    this.paginaAtual =
                        page;

                    this.tamanhoPagina =
                        size;

                    this.filtro =
                        filtro;
                },
                error: () => {
                    this.toastr.error(
                        'Nao foi possivel carregar os estabelecimentos'
                    );
                }
            });
    }

    pesquisar(
        filtro: string
    ): void {
        this.carregarLista(
            0,
            this.tamanhoPagina,
            filtro ?? ''
        );
    }

    quantidadePorPagina(
        parametros: {
            page: number;
            size: number;
        }
    ): void {
        this.carregarLista(
            parametros.page,
            parametros.size,
            this.filtro
        );
    }

    botaoAdicionar(): void {
        if (!this.podeCriar) {
            return;
        }

        this.isLista = false;
        this.isFormulario = true;
        this.isVisualizacao = false;
        this.empresaNome = '';
        this.empresas = [];

        this.formulario =
            this.builder.group({
                idEmpresa: [
                    null,
                    Validators.required
                ],
                nome: [
                    '',
                    [
                        Validators.required,
                        Validators.maxLength(
                            100
                        )
                    ]
                ]
            });

        this.empresaPesquisaControl
            .setValue(
                '',
                {
                    emitEvent: false
                }
            );

        this.carregarEmpresas('');
    }

    botaoEditar(
        id: number
    ): void {
        if (!this.podeEditar) {
            return;
        }

        this.carregarFormulario(
            id,
            false
        );
    }

    botaoVisualizar(
        id: number
    ): void {
        if (!this.podeDetalhar) {
            return;
        }

        this.carregarFormulario(
            id,
            true
        );
    }

    salvar(): void {
        if (
            !this.podeSalvar ||
            this.formulario.invalid
        ) {
            return;
        }

        const id =
            this.formulario
                .get('id')
                ?.value;

        if (id) {
            this.service
                .atualizar({
                    id,
                    nome:
                        this.formulario
                            .get('nome')
                            ?.value
                })
                .subscribe({
                    next: () => {
                        this.finalizarSalvamento(
                            'Estabelecimento atualizado com sucesso'
                        );
                    },
                    error: () => {
                        this.toastr.error(
                            'Nao foi possivel atualizar o estabelecimento'
                        );
                    }
                });

            return;
        }

        this.service
            .cadastrar({
                idEmpresa:
                    this.formulario
                        .get('idEmpresa')
                        ?.value,
                nome:
                    this.formulario
                        .get('nome')
                        ?.value
            })
            .subscribe({
                next: () => {
                    this.finalizarSalvamento(
                        'Estabelecimento cadastrado com sucesso'
                    );
                },
                error: () => {
                    this.toastr.error(
                        'Nao foi possivel cadastrar o estabelecimento'
                    );
                }
            });
    }

    botaoExcluir(
        id: number
    ): void {
        if (!this.podeExcluir) {
            return;
        }

        this.service
            .excluir(id)
            .subscribe({
                next: () => {
                    this.carregarLista();

                    this.toastr.info(
                        'Estabelecimento removido com sucesso'
                    );
                },
                error: () => {
                    this.toastr.error(
                        'Nao foi possivel remover o estabelecimento'
                    );
                }
            });
    }

    selecionarEmpresa(
        empresa: Empresa
    ): void {
        this.formulario
            .get('idEmpresa')
            ?.setValue(
                empresa.id
            );

        this.empresaNome =
            empresa.nome;
    }

    exibirEmpresa(
        valor:
            Empresa | string | null
    ): string {
        if (!valor) {
            return '';
        }

        return typeof valor === 'string'
            ? valor
            : valor.nome;
    }

    cancelar(): void {
        this.isLista = true;
        this.isFormulario = false;
        this.isVisualizacao = false;
        this.empresaNome = '';
        this.empresas = [];

        if (this.formulario) {
            this.formulario.reset();
        }

        this.empresaPesquisaControl
            .reset(
                '',
                {
                    emitEvent: false
                }
            );
    }

    private configurarAtualizacaoPorOrganizacao(): void {
        this.contextoOrganizacaoService
            .retornarOrganizacaoProntaObservable()
            .pipe(
                skip(1),
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe((organizacao) => {
                this.limparEstadoPorTrocaOrganizacao();

                if (organizacao) {
                    this.carregarLista(
                        0,
                        this.tamanhoPagina,
                        ''
                    );
                }
            });
    }

    private limparEstadoPorTrocaOrganizacao(): void {
        this.cancelar();

        this.lista = [];
        this.empresas = [];
        this.totalRegistros = 0;
        this.paginaAtual = 0;
        this.filtro = '';
    }

    private configurarPesquisaDeEmpresa(): void {
        this.empresaPesquisaControl
            .valueChanges
            .pipe(
                takeUntilDestroyed(
                    this.destroyRef
                ),
                debounceTime(300),
                filter(
                    (
                        valor
                    ): valor is string =>
                        typeof valor ===
                        'string'
                ),
                distinctUntilChanged()
            )
            .subscribe((filtro) => {
                if (
                    this.formulario &&
                    this.cadastrando
                ) {
                    this.formulario
                        .get('idEmpresa')
                        ?.setValue(null);
                }

                this.carregarEmpresas(
                    filtro
                );
            });
    }

    private carregarEmpresas(
        filtro: string
    ): void {
        this.service
            .listarEmpresas(
                filtro,
                0,
                10
            )
            .subscribe({
                next: (pagina) => {
                    this.empresas =
                        pagina.content;
                },
                error: () => {
                    this.empresas = [];

                    this.toastr.error(
                        'Nao foi possivel pesquisar as empresas'
                    );
                }
            });
    }

    private carregarFormulario(
        id: number,
        visualizacao: boolean
    ): void {
        this.service
            .detalhar(id)
            .subscribe({
                next: (dados) => {
                    this.isLista = false;
                    this.isFormulario = true;
                    this.isVisualizacao =
                        visualizacao;

                    this.empresaNome =
                        dados.empresa ?? '';

                    this.formulario =
                        this.builder.group({
                            id: [
                                dados.id
                            ],
                            nome: [
                                dados.nome,
                                [
                                    Validators.required,
                                    Validators.maxLength(
                                        100
                                    )
                                ]
                            ]
                        });

                    if (visualizacao) {
                        this.formulario
                            .disable();
                    }
                },
                error: () => {
                    this.toastr.error(
                        'Nao foi possivel detalhar o estabelecimento'
                    );
                }
            });
    }

    private finalizarSalvamento(
        mensagem: string
    ): void {
        this.cancelar();
        this.carregarLista();

        this.toastr.success(
            mensagem
        );
    }
}