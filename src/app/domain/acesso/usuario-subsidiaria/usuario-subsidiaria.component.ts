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
    SubsidiariaService
} from '@/domain/configuracao/subsidiaria/services/subsidiaria.service';

import {
    Subsidiaria,
    UsuarioEmpresa,
    UsuarioSubsidiaria
} from '@/interfaces/interfaces';

import {
    ItemBreadcrumbPagina
} from '@components/cabecalho-pagina/cabecalho-pagina.component';

import {
    UsuarioSubsidiariaService
} from './services/usuario-subsidiaria.service';

@Component({
    selector: 'app-usuario-subsidiaria',
    templateUrl:
        './usuario-subsidiaria.component.html',
    styleUrls: [
        './usuario-subsidiaria.component.scss'
    ],
    standalone: false
})
export class UsuarioSubsidiariaComponent
    implements OnInit {

    private readonly service =
        inject(
            UsuarioSubsidiariaService
        );

    private readonly usuarioEmpresaService =
        inject(
            UsuarioEmpresaService
        );

    private readonly subsidiariaService =
        inject(
            SubsidiariaService
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
        'Subsidiarias do usuario';

    descricao =
        'Gerencie as subsidiarias vinculadas ao usuario na empresa';

    breadcrumb:
        ItemBreadcrumbPagina[] = [];

    coluna = [
        'Codigo do vinculo empresa',
        'Usuario',
        'Empresa',
        'Codigo da subsidiaria',
        'Subsidiaria',
        'Status'
    ];

    lista:
        UsuarioSubsidiaria[] = [];

    subsidiarias:
        Subsidiaria[] = [];

    totalRegistros = 0;

    paginaAtual = 0;

    tamanhoPagina = 10;

    isLista = true;

    isFormulario = false;

    isVisualizacao = false;

    formulario!: FormGroup;

    usuarioNome = '';

    empresaNome = '';

    subsidiariaNome = '';

    subsidiariaPesquisaControl =
        new FormControl<
            string | Subsidiaria | null
        >('');

    get podeCriar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .UsuarioSubsidiariaCriar
            );
    }

    get podeExcluir(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .UsuarioSubsidiariaExcluir
            );
    }

    get podeDetalhar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .UsuarioSubsidiariaDetalhar
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
        this.configurarPesquisaDeSubsidiaria();
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
                        'Nao foi possivel carregar as subsidiarias do usuario'
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

        this.subsidiariaNome = '';
        this.subsidiarias = [];

        this.formulario =
            this.builder.group({
                idUsuarioEmpresa: [
                    this.idUsuarioEmpresa,
                    Validators.required
                ],
                idSubsidiaria: [
                    null,
                    Validators.required
                ]
            });

        this.subsidiariaPesquisaControl
            .setValue(
                '',
                {
                    emitEvent: false
                }
            );

        this.carregarSubsidiarias('');
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

                    this.subsidiariaNome =
                        dados.subsidiaria ?? '';

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
                            idSubsidiaria: [
                                dados.idSubsidiaria
                            ],
                            subsidiaria: [
                                dados.subsidiaria
                            ],
                            status: [
                                dados.status
                            ]
                        });

                    this.formulario.disable();
                },
                error: () => {
                    this.toastr.error(
                        'Nao foi possivel detalhar a subsidiaria do usuario'
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
                idSubsidiaria:
                    this.formulario
                        .get(
                            'idSubsidiaria'
                        )
                        ?.value
            })
            .subscribe({
                next: () => {
                    this.cancelar();
                    this.carregarLista();

                    this.toastr.success(
                        'Subsidiaria vinculada com sucesso'
                    );
                },
                error: () => {
                    this.toastr.error(
                        'Nao foi possivel vincular a subsidiaria'
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
                        'Subsidiaria removida do usuario'
                    );
                },
                error: () => {
                    this.toastr.error(
                        'Nao foi possivel remover a subsidiaria do usuario'
                    );
                }
            });
    }

    selecionarSubsidiaria(
        subsidiaria: Subsidiaria
    ): void {
        this.formulario
            .get('idSubsidiaria')
            ?.setValue(
                subsidiaria.id
            );

        this.subsidiariaNome =
            subsidiaria.nome;
    }

    exibirSubsidiaria(
        valor:
            Subsidiaria | string | null
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

        this.subsidiarias = [];
        this.subsidiariaNome = '';

        if (this.formulario) {
            this.formulario.reset();
        }

        this.subsidiariaPesquisaControl
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
                        dados.todasSubsidiarias
                    ) {
                        this.toastr.info(
                            'Usuario ja possui acesso a todas as subsidiarias da empresa'
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

    private configurarPesquisaDeSubsidiaria(): void {
        this.subsidiariaPesquisaControl
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
                            'idSubsidiaria'
                        )
                        ?.setValue(null);
                }

                this.carregarSubsidiarias(
                    filtro
                );
            });
    }

    private carregarSubsidiarias(
        filtro: string
    ): void {
        if (
            !Number.isInteger(
                this.idEmpresa
            ) ||
            this.idEmpresa <= 0
        ) {
            this.subsidiarias = [];

            return;
        }

        this.subsidiariaService
            .listar(
                0,
                10,
                'nome,asc',
                filtro,
                this.idEmpresa
            )
            .subscribe({
                next: (pagina) => {
                    this.subsidiarias =
                        pagina.content;
                },
                error: () => {
                    this.subsidiarias = [];

                    this.toastr.error(
                        'Nao foi possivel pesquisar as subsidiarias'
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
        this.subsidiarias = [];
        this.totalRegistros = 0;
        this.paginaAtual = 0;
        this.tamanhoPagina = 10;
        this.idEmpresa = 0;
        this.usuarioNome = '';
        this.empresaNome = '';
    }

    private mapearLista(
        lista:
            UsuarioSubsidiaria[]
    ): UsuarioSubsidiaria[] {
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
                idSubsidiaria:
                    item.idSubsidiaria,
                subsidiaria:
                    item.subsidiaria,
                status:
                    item.status
            })
        );
    }
}