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
    ActivatedRoute,
    Router
} from '@angular/router';

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
    UsuarioEmpresaService
} from '@/domain/acesso/usuario-empresa/services/usuario-empresa.service';

import {
    EstabelecimentoService
} from '@/domain/configuracao/estabelecimento/services/estabelecimento.service';

import {
    Estabelecimento,
    UsuarioEmpresa,
    UsuarioEstabelecimento
} from '@/interfaces/interfaces';

import {
    ItemBreadcrumbPagina
} from '@components/cabecalho-pagina/cabecalho-pagina.component';

import {
    UsuarioEstabelecimentoService
} from './services/usuario-estabelecimento.service';

@Component({
    selector: 'app-usuario-estabelecimento',
    templateUrl:
        './usuario-estabelecimento.component.html',
    styleUrls: [
        './usuario-estabelecimento.component.scss'
    ],
    standalone: false
})
export class UsuarioEstabelecimentoComponent
    implements OnInit {

    private readonly service =
        inject(
            UsuarioEstabelecimentoService
        );

    private readonly usuarioEmpresaService =
        inject(
            UsuarioEmpresaService
        );

    private readonly estabelecimentoService =
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

    private readonly route =
        inject(
            ActivatedRoute
        );

    private readonly router =
        inject(
            Router
        );

    private readonly toastr =
        inject(
            ToastrService
        );

    private readonly destroyRef =
        inject(
            DestroyRef
        );

    idUsuario = 0;

    idUsuarioEmpresa = 0;

    idEmpresa = 0;

    pagina =
        'Estabelecimentos do usuario';

    descricao =
        'Gerencie os estabelecimentos vinculados ao usuario na empresa';

    breadcrumb:
        ItemBreadcrumbPagina[] = [];

    coluna = [
        'Codigo do vinculo empresa',
        'Usuario',
        'Empresa',
        'Codigo do estabelecimento',
        'Estabelecimento',
        'Status'
    ];

    lista:
        UsuarioEstabelecimento[] = [];

    estabelecimentos:
        Estabelecimento[] = [];

    totalRegistros = 0;

    paginaAtual = 0;

    tamanhoPagina = 10;

    isLista = true;

    isFormulario = false;

    isVisualizacao = false;

    formulario!: FormGroup;

    usuarioNome = '';

    empresaNome = '';

    estabelecimentoNome = '';

    estabelecimentoPesquisaControl =
        new FormControl<
            string | Estabelecimento | null
        >('');

    get podeCriar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .UsuarioEstabelecimentoCriar
            );
    }

    get podeExcluir(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .UsuarioEstabelecimentoExcluir
            );
    }

    get podeDetalhar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .UsuarioEstabelecimentoDetalhar
            );
    }

    ngOnInit(): void {
        this.idUsuario =
            Number(
                this.route.snapshot
                    .paramMap
                    .get('idUsuario')
            );

        this.idUsuarioEmpresa =
            Number(
                this.route.snapshot
                    .paramMap
                    .get(
                        'idUsuarioEmpresa'
                    )
            );

        if (
            !Number.isInteger(
                this.idUsuario
            ) ||
            this.idUsuario <= 0 ||
            !Number.isInteger(
                this.idUsuarioEmpresa
            ) ||
            this.idUsuarioEmpresa <= 0
        ) {
            void this.router.navigate([
                '/acesso/usuarios'
            ]);

            return;
        }

        this.configurarCabecalho();
        this.configurarPesquisaDeEstabelecimento();
        this.configurarAtualizacaoPorOrganizacao();
        this.carregarContextoELista();
    }

    carregarLista(
        page = this.paginaAtual,
        size = this.tamanhoPagina
    ): void {
        this.service
            .listar(
                page,
                size,
                'id,desc',
                this.idUsuarioEmpresa
            )
            .subscribe({
                next: (pagina) => {
                    this.lista =
                        this.mapearLista(
                            pagina.content
                        );

                    this.totalRegistros =
                        pagina.totalElements;

                    this.paginaAtual =
                        page;

                    this.tamanhoPagina =
                        size;
                },
                error: () => {
                    this.toastr.error(
                        'Nao foi possivel carregar os estabelecimentos do usuario'
                    );
                }
            });
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

    botaoAdicionar(): void {
        if (!this.podeCriar) {
            return;
        }

        this.isLista = false;
        this.isFormulario = true;
        this.isVisualizacao = false;

        this.estabelecimentoNome = '';
        this.estabelecimentos = [];

        this.formulario =
            this.builder.group({
                idUsuarioEmpresa: [
                    this.idUsuarioEmpresa,
                    Validators.required
                ],
                idEstabelecimento: [
                    null,
                    Validators.required
                ]
            });

        this.estabelecimentoPesquisaControl
            .setValue(
                '',
                {
                    emitEvent: false
                }
            );

        this.carregarEstabelecimentos('');
    }

    botaoVisualizar(
        id: number
    ): void {
        if (!this.podeDetalhar) {
            return;
        }

        this.service
            .detalhar(id)
            .subscribe({
                next: (dados) => {
                    this.isLista = false;
                    this.isFormulario = true;
                    this.isVisualizacao = true;

                    this.usuarioNome =
                        dados.usuario ?? '';

                    this.empresaNome =
                        dados.empresa ?? '';

                    this.estabelecimentoNome =
                        dados.estabelecimento ?? '';

                    this.formulario =
                        this.builder.group({
                            id: [
                                dados.id
                            ],
                            idUsuarioEmpresa: [
                                dados.idUsuarioEmpresa
                            ],
                            usuario: [
                                dados.usuario
                            ],
                            empresa: [
                                dados.empresa
                            ],
                            idEstabelecimento: [
                                dados.idEstabelecimento
                            ],
                            estabelecimento: [
                                dados.estabelecimento
                            ],
                            status: [
                                dados.status
                            ]
                        });

                    this.formulario.disable();
                },
                error: () => {
                    this.toastr.error(
                        'Nao foi possivel detalhar o estabelecimento do usuario'
                    );
                }
            });
    }

    salvar(): void {
        if (
            !this.podeCriar ||
            this.formulario.invalid
        ) {
            return;
        }

        this.service
            .cadastrar({
                idUsuarioEmpresa:
                    this.formulario
                        .get(
                            'idUsuarioEmpresa'
                        )
                        ?.value,
                idEstabelecimento:
                    this.formulario
                        .get(
                            'idEstabelecimento'
                        )
                        ?.value
            })
            .subscribe({
                next: () => {
                    this.cancelar();
                    this.carregarLista();

                    this.toastr.success(
                        'Estabelecimento vinculado com sucesso'
                    );
                },
                error: () => {
                    this.toastr.error(
                        'Nao foi possivel vincular o estabelecimento'
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
                        'Estabelecimento removido do usuario'
                    );
                },
                error: () => {
                    this.toastr.error(
                        'Nao foi possivel remover o estabelecimento do usuario'
                    );
                }
            });
    }

    selecionarEstabelecimento(
        estabelecimento: Estabelecimento
    ): void {
        this.formulario
            .get('idEstabelecimento')
            ?.setValue(
                estabelecimento.id
            );

        this.estabelecimentoNome =
            estabelecimento.nome;
    }

    exibirEstabelecimento(
        valor:
            Estabelecimento | string | null
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

        this.estabelecimentos = [];
        this.estabelecimentoNome = '';

        if (this.formulario) {
            this.formulario.reset();
        }

        this.estabelecimentoPesquisaControl
            .reset(
                '',
                {
                    emitEvent: false
                }
            );
    }

    voltar(): void {
        void this.router.navigate([
            '/acesso/usuarios',
            this.idUsuario,
            'empresas'
        ]);
    }

    private configurarCabecalho(): void {
        this.breadcrumb = [
            {
                titulo:
                    'Acesso e Seguranca'
            },
            {
                titulo:
                    'Usuarios',
                rota:
                    '/acesso/usuarios'
            },
            {
                titulo:
                    'Empresas do usuario',
                rota:
                    `/acesso/usuarios/${this.idUsuario}/empresas`
            }
        ];
    }

    private carregarContextoELista(): void {
        this.usuarioEmpresaService
            .detalhar(
                this.idUsuarioEmpresa
            )
            .subscribe({
                next: (dados) => {
                    if (
                        dados.idUsuario !==
                        this.idUsuario
                    ) {
                        this.toastr.error(
                            'Vinculo nao pertence ao usuario informado'
                        );

                        this.voltar();

                        return;
                    }

                    if (
                        dados.todosEstabelecimentos
                    ) {
                        this.toastr.info(
                            'Usuario ja possui acesso a todos os estabelecimentos da empresa'
                        );

                        this.voltar();

                        return;
                    }

                    this.definirContexto(
                        dados
                    );

                    this.carregarLista();
                },
                error: () => {
                    this.toastr.error(
                        'Nao foi possivel validar a empresa do usuario'
                    );

                    this.voltar();
                }
            });
    }

    private definirContexto(
        dados: UsuarioEmpresa
    ): void {
        this.idEmpresa =
            dados.idEmpresa;

        this.usuarioNome =
            dados.usuario ?? '';

        this.empresaNome =
            dados.empresa ?? '';
    }

    private configurarPesquisaDeEstabelecimento(): void {
        this.estabelecimentoPesquisaControl
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
                if (this.formulario) {
                    this.formulario
                        .get(
                            'idEstabelecimento'
                        )
                        ?.setValue(null);
                }

                this.carregarEstabelecimentos(
                    filtro
                );
            });
    }

    private carregarEstabelecimentos(
        filtro: string
    ): void {
        if (
            !Number.isInteger(
                this.idEmpresa
            ) ||
            this.idEmpresa <= 0
        ) {
            this.estabelecimentos = [];

            return;
        }

        this.estabelecimentoService
            .listar(
                0,
                10,
                'nome,asc',
                filtro,
                this.idEmpresa
            )
            .subscribe({
                next: (pagina) => {
                    this.estabelecimentos =
                        pagina.content;
                },
                error: () => {
                    this.estabelecimentos = [];

                    this.toastr.error(
                        'Nao foi possivel pesquisar os estabelecimentos'
                    );
                }
            });
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
                    this.voltar();
                }
            });
    }

    private limparEstadoPorTrocaOrganizacao(): void {
        this.cancelar();

        this.lista = [];
        this.estabelecimentos = [];
        this.totalRegistros = 0;
        this.paginaAtual = 0;
        this.tamanhoPagina = 10;
        this.idEmpresa = 0;
        this.usuarioNome = '';
        this.empresaNome = '';
    }

    private mapearLista(
        lista:
            UsuarioEstabelecimento[]
    ): UsuarioEstabelecimento[] {
        return lista.map(
            (item) => ({
                id:
                    item.id,
                idUsuarioEmpresa:
                    item.idUsuarioEmpresa,
                usuario:
                    item.usuario,
                empresa:
                    item.empresa,
                idEstabelecimento:
                    item.idEstabelecimento,
                estabelecimento:
                    item.estabelecimento,
                status:
                    item.status
            })
        );
    }
}