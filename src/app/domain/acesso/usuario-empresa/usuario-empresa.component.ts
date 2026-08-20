import {
    Component,
    DestroyRef,
    OnInit,
    inject
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
    takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import {
    debounceTime,
    distinctUntilChanged,
    filter
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
    Empresa,
    UsuarioEmpresa
} from '@/interfaces/interfaces';

import {
    UsuarioEmpresaService
} from './services/usuario-empresa.service';

import {
    ItemBreadcrumbPagina
} from '@components/cabecalho-pagina/cabecalho-pagina.component';

@Component({
    selector: 'app-usuario-empresa',
    templateUrl:
        './usuario-empresa.component.html',
    styleUrls: [
        './usuario-empresa.component.scss'
    ],
    standalone: false
})
export class UsuarioEmpresaComponent
    implements OnInit {

    private readonly service =
        inject(
            UsuarioEmpresaService
        );

    private readonly autorizacaoService =
        inject(
            AutorizacaoService
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

    pagina =
        'Empresas do usuário';

    descricao =
        'Gerencie as empresas vinculadas ao usuário';

    breadcrumb: ItemBreadcrumbPagina[] = [
        {
            titulo:
                'Acesso e Segurança'
        },
        {
            titulo: 'Usuários',
            rota: '/acesso/usuarios'
        }
    ];

    coluna = [
        'Código do usuário',
        'Usuário',
        'Código da empresa',
        'Empresa',
        'Todas as subsidiárias',
        'Status'
    ];

    lista: UsuarioEmpresa[] = [];

    empresas: Empresa[] = [];

    totalRegistros = 0;

    paginaAtual = 0;

    tamanhoPagina = 10;

    isLista = true;

    isFormulario = false;

    isVisualizacao = false;

    formulario!: FormGroup;

    empresaPesquisaControl =
        new FormControl<
            string | Empresa | null
        >('');

    usuarioNome = '';

    empresaNome = '';

    get podeCriar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .UsuarioEmpresaCriar
            );
    }

    get podeEditar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .UsuarioEmpresaEditar
            );
    }

    get podeExcluir(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .UsuarioEmpresaExcluir
            );
    }

    get podeDetalhar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .UsuarioEmpresaDetalhar
            );
    }

    get cadastrando(): boolean {
        return !this.formulario
            ?.get('id')
            ?.value;
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

    ngOnInit(): void {
        const parametro =
            this.route.snapshot
                .paramMap
                .get('idUsuario');

        this.idUsuario =
            Number(parametro);

        if (
            !Number.isInteger(
                this.idUsuario
            ) ||
            this.idUsuario <= 0
        ) {
            this.router.navigate([
                '/acesso/usuarios'
            ]);

            return;
        }

        this.configurarPesquisaDeEmpresa();
        this.carregarLista();
    }

    carregarLista(
        page = this.paginaAtual,
        size = this.tamanhoPagina
    ): void {
        this.service.listar(
            page,
            size,
            'id,desc',
            this.idUsuario
        ).subscribe({
            next: (pagina) => {
                this.lista =
                    pagina.content;

                this.totalRegistros =
                    pagina.totalElements;

                this.paginaAtual = page;
                this.tamanhoPagina = size;
            },
            error: () => {
                this.toastr.error(
                    'Não foi possível carregar as empresas do usuário'
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

        this.usuarioNome = '';
        this.empresaNome = '';
        this.empresas = [];

        this.formulario =
            this.builder.group({
                idUsuario: [
                    this.idUsuario,
                    Validators.required
                ],
                idEmpresa: [
                    null,
                    Validators.required
                ],
                todasSubsidiarias: [
                    false
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
            this.service.atualizar({
                id,
                todasSubsidiarias:
                    this.formulario
                        .get(
                            'todasSubsidiarias'
                        )
                        ?.value
            }).subscribe({
                next: () => {
                    this.finalizarSalvamento(
                        'Vínculo atualizado com sucesso'
                    );
                },
                error: () => {
                    this.toastr.error(
                        'Não foi possível atualizar o vínculo'
                    );
                }
            });

            return;
        }

        this.service.cadastrar({
            idUsuario:
                this.formulario
                    .get('idUsuario')
                    ?.value,
            idEmpresa:
                this.formulario
                    .get('idEmpresa')
                    ?.value,
            todasSubsidiarias:
                this.formulario
                    .get(
                        'todasSubsidiarias'
                    )
                    ?.value
        }).subscribe({
            next: () => {
                this.finalizarSalvamento(
                    'Empresa vinculada ao usuário com sucesso'
                );
            },
            error: () => {
                this.toastr.error(
                    'Não foi possível vincular a empresa ao usuário'
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

        this.service.excluir(id)
            .subscribe({
                next: () => {
                    this.carregarLista();

                    this.toastr.info(
                        'Empresa removida do usuário'
                    );
                },
                error: () => {
                    this.toastr.error(
                        'Não foi possível remover a empresa do usuário'
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

        this.usuarioNome = '';
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

    voltar(): void {
        this.router.navigate([
            '/acesso/usuarios'
        ]);
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
                        'Não foi possível pesquisar as empresas'
                    );
                }
            });
    }

    private carregarFormulario(
        id: number,
        visualizacao: boolean
    ): void {
        this.service.detalhar(id)
            .subscribe({
                next: (dados) => {
                    this.isLista = false;
                    this.isFormulario = true;
                    this.isVisualizacao =
                        visualizacao;

                    this.usuarioNome =
                        dados.usuario ?? '';

                    this.empresaNome =
                        dados.empresa ?? '';

                    this.formulario =
                        this.builder.group({
                            id: [
                                dados.id
                            ],
                            todasSubsidiarias: [
                                dados
                                    .todasSubsidiarias
                            ]
                        });

                    if (visualizacao) {
                        this.formulario
                            .disable();
                    }
                },
                error: () => {
                    this.toastr.error(
                        'Não foi possível detalhar o vínculo'
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