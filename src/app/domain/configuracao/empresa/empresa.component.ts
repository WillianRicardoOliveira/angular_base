import {
    Location
} from '@angular/common';

import {
    Component,
    DestroyRef,
    inject
} from '@angular/core';

import {
    takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import {
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';

import {
    ActivatedRoute,
    Router
} from '@angular/router';

import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    filter,
    of,
    skip,
    switchMap,
    tap
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
    ConfiguracaoInicialService
} from '@/domain/configuracao/configuracao-inicial/services/configuracao-inicial.service';

import {
    Empresa,
    Pais,
    TipoDocumentoFiscalOpcao
} from '@/interfaces/interfaces';

import {
    Base
} from '@components/grid/base/base';

import {
    ItemBreadcrumbPagina
} from '@components/cabecalho-pagina/cabecalho-pagina.component';

import {
    PaisService
} from '../pais/services/pais.service';

import {
    EmpresaService as EmpresaConfiguracaoService
} from './services/empresa.service';

@Component({
    selector: 'app-empresa',
    templateUrl: './empresa.component.html',
    styleUrls: [
        './empresa.component.scss'
    ],
    standalone: false
})
export class EmpresaComponent extends Base {

    private readonly paisService =
        inject(
            PaisService
        );

    private readonly empresaService =
        inject(
            EmpresaConfiguracaoService
        );

    private readonly autorizacaoService =
        inject(
            AutorizacaoService
        );

    private readonly contextoOrganizacaoService =
        inject(
            ContextoOrganizacaoService
        );

    private readonly activatedRoute =
        inject(
            ActivatedRoute
        );

    private readonly roteador =
        inject(
            Router
        );

    private readonly location =
        inject(
            Location
        );

    private readonly configuracaoInicialService =
        inject(
            ConfiguracaoInicialService
        );

    private readonly toastrService =
        inject(
            ToastrService
        );

    private readonly destroyRef =
        inject(
            DestroyRef
        );

    private cadastroInicial = false;

    private idEmpresaAtualFormulario:
        number | null = null;

    paises: Pais[] = [];

    tiposDocumentoFiscal:
        TipoDocumentoFiscalOpcao[] = [];

    empresasControladoras:
        Empresa[] = [];

    empresaControladoraPesquisaControl =
        new FormControl<
            string | Empresa | null
        >('');

    get podeCriar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao.EmpresaCriar
            );
    }

    get podeListar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao.EmpresaListar
            );
    }

    get podeEditar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao.EmpresaEditar
            );
    }

    get podeExcluir(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao.EmpresaExcluir
            );
    }

    get podeDetalhar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao.EmpresaDetalhar
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

    pagina = 'Empresas';

    descricao =
        'Gerencie as empresas do sistema';

    breadcrumb: ItemBreadcrumbPagina[] = [
        {
            titulo: 'Configuracao'
        }
    ];

    endPoint = 'configuracao/empresa';

    coluna = [
        'ID empresa controladora',
        'Empresa controladora',
        'Nome',
        'Razao social',
        'Pais',
        'Tipo documento',
        'Documento fiscal',
        'Status'
    ];

    override ngOnInit(): void {
        this.carregarPaises();
        this.configurarPesquisaEmpresaControladora();

        this.cadastroInicial =
            this.rotaIndicaCadastroInicial();

        this.configurarAtualizacaoPorOrganizacao();

        if (this.ehCadastroInicial()) {
            if (this.podeCriar) {
                this.botaoAdicionar();
            } else {
                this.voltarParaConfiguracaoInicial();
            }

            return;
        }

        if (this.podeListar) {
            super.ngOnInit();

            return;
        }

        if (this.podeCriar) {
            this.botaoAdicionar();

            return;
        }

        this.navegarParaInicio();
    }

    campos(
        dados?: Empresa
    ): FormGroup {
        if (dados) {
            const formulario =
                this.builder.group({
                    id: [
                        dados.id
                    ],
                    idEmpresaControladora: [
                        dados.idEmpresaControladora ??
                            null
                    ],
                    nome: [
                        dados.nome,
                        [
                            Validators.required,
                            Validators.maxLength(100)
                        ]
                    ],
                    razaoSocial: [
                        dados.razaoSocial ?? '',
                        [
                            Validators.required,
                            Validators.maxLength(150)
                        ]
                    ],
                    pais: [
                        dados.pais ?? '',
                        [
                            Validators.required,
                            Validators.minLength(2),
                            Validators.maxLength(2)
                        ]
                    ],
                    tipoDocumentoFiscal: [
                        dados.tipoDocumentoFiscal ?? '',
                        [
                            Validators.required
                        ]
                    ],
                    documentoFiscal: [
                        dados.documentoFiscal ?? '',
                        [
                            Validators.required,
                            Validators.maxLength(30)
                        ]
                    ],
                    inscricaoEstadual: [
                        dados.inscricaoEstadual ?? '',
                        [
                            Validators.maxLength(30)
                        ]
                    ],
                    inscricaoMunicipal: [
                        dados.inscricaoMunicipal ?? '',
                        [
                            Validators.maxLength(30)
                        ]
                    ]
                });

            this.prepararEmpresaControladora(
                formulario,
                dados
            );

            this.configurarTiposDocumentoFiscalPorPais(
                formulario
            );

            return formulario;
        }

        const formulario =
            this.builder.group({
                idEmpresaControladora: [
                    null
                ],
                nome: [
                    '',
                    [
                        Validators.required,
                        Validators.maxLength(100)
                    ]
                ],
                razaoSocial: [
                    '',
                    [
                        Validators.required,
                        Validators.maxLength(150)
                    ]
                ],
                pais: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(2),
                        Validators.maxLength(2)
                    ]
                ],
                tipoDocumentoFiscal: [
                    '',
                    [
                        Validators.required
                    ]
                ],
                documentoFiscal: [
                    '',
                    [
                        Validators.required,
                        Validators.maxLength(30)
                    ]
                ],
                inscricaoEstadual: [
                    '',
                    [
                        Validators.maxLength(30)
                    ]
                ],
                inscricaoMunicipal: [
                    '',
                    [
                        Validators.maxLength(30)
                    ]
                ]
            });

        this.prepararEmpresaControladora(
            formulario
        );

        this.configurarTiposDocumentoFiscalPorPais(
            formulario
        );

        return formulario;
    }

    cancelarEmpresa(): void {
        if (this.ehCadastroInicial()) {
            this.voltarParaConfiguracaoInicial();

            return;
        }

        if (!this.podeListar) {
            this.navegarParaInicio();

            return;
        }

        this.cancelar();
        this.limparEmpresaControladora();
    }

    selecionarEmpresaControladora(
        empresa: Empresa
    ): void {
        this.formulario
            .get('idEmpresaControladora')
            ?.setValue(
                empresa.id ?? null
            );
    }

    exibirEmpresaControladora(
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

    protected override aposSalvar(
        _value: unknown
    ): boolean {
        const novoCadastro =
            !this.formulario
                ?.get('id')
                ?.value;

        if (!novoCadastro) {
            return false;
        }

        this.configuracaoInicialService
            .recarregar()
            .pipe(
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe({
                next: (estado) => {
                    if (
                        estado.proximaEtapa !==
                        null
                    ) {
                        this.voltarParaConfiguracaoInicial();

                        return;
                    }

                    this.cadastroInicial = false;

                    if (!this.podeListar) {
                        this.navegarParaInicio();

                        return;
                    }

                    this.location.replaceState(
                        '/configuracao/empresas'
                    );

                    this.isFormulario = false;
                    this.isLista = true;

                    this.carregarLista();
                },
                error: () => {
                    this.voltarParaConfiguracaoInicial();
                }
            });

        return true;
    }

    protected override aposExcluir(
        _id: number
    ): boolean {
        this.configuracaoInicialService
            .recarregar()
            .pipe(
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe({
                next: (estado) => {
                    if (
                        estado.proximaEtapa !==
                        null
                    ) {
                        this.voltarParaConfiguracaoInicial();

                        return;
                    }

                    if (this.podeListar) {
                        this.carregarLista();

                        return;
                    }

                    this.navegarParaInicio();
                },
                error: () => {
                    if (this.podeListar) {
                        this.carregarLista();

                        return;
                    }

                    this.navegarParaInicio();
                }
            });

        return true;
    }

    private carregarPaises(): void {
        this.paisService
            .listar()
            .pipe(
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe({
                next: (paises) => {
                    this.paises =
                        paises;
                },
                error: () => {
                    this.paises = [];

                    this.toastrService.error(
                        'Nao foi possivel carregar os paises'
                    );
                }
            });
    }

    private configurarPesquisaEmpresaControladora(): void {
        this.empresaControladoraPesquisaControl
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
                    !this.isVisualizacao
                ) {
                    this.formulario
                        .get('idEmpresaControladora')
                        ?.setValue(null);
                }

                this.carregarEmpresasControladoras(
                    filtro
                );
            });
    }

    private prepararEmpresaControladora(
        formulario: FormGroup,
        dados?: Empresa
    ): void {
        this.idEmpresaAtualFormulario =
            dados?.id ?? null;

        this.empresasControladoras = [];

        this.empresaControladoraPesquisaControl
            .enable({
                emitEvent: false
            });

        this.empresaControladoraPesquisaControl
            .setValue(
                dados?.empresaControladora ?? '',
                {
                    emitEvent: false
                }
            );

        if (this.isVisualizacao) {
            this.empresaControladoraPesquisaControl
                .disable({
                    emitEvent: false
                });

            return;
        }

        if (this.podeListar) {
            this.carregarEmpresasControladoras('');
        }

        if (
            !dados?.idEmpresaControladora &&
            formulario
                .get('idEmpresaControladora')
                ?.value
        ) {
            formulario
                .get('idEmpresaControladora')
                ?.setValue(null);
        }
    }

    private carregarEmpresasControladoras(
        filtro: string
    ): void {
        if (!this.podeListar) {
            this.empresasControladoras = [];

            return;
        }

        this.empresaService
            .listar(
                filtro,
                0,
                20
            )
            .pipe(
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe({
                next: (pagina) => {
                    this.empresasControladoras =
                        pagina.content
                            .filter(
                                (empresa) =>
                                    empresa.id !==
                                    this.idEmpresaAtualFormulario
                            );
                },
                error: () => {
                    this.empresasControladoras = [];

                    this.toastrService.error(
                        'Nao foi possivel pesquisar as empresas controladoras'
                    );
                }
            });
    }

    private limparEmpresaControladora(): void {
        this.idEmpresaAtualFormulario = null;
        this.empresasControladoras = [];

        this.empresaControladoraPesquisaControl
            .reset(
                '',
                {
                    emitEvent: false
                }
            );

        this.empresaControladoraPesquisaControl
            .enable({
                emitEvent: false
            });
    }

    private configurarTiposDocumentoFiscalPorPais(
        formulario: FormGroup
    ): void {
        const paisControl =
            formulario.get('pais');

        const tipoDocumentoFiscalControl =
            formulario.get(
                'tipoDocumentoFiscal'
            );

        if (
            !paisControl ||
            !tipoDocumentoFiscalControl
        ) {
            return;
        }

        this.tiposDocumentoFiscal = [];

        const paisInicial =
            this.normalizarPais(
                paisControl.value
            );

        if (paisInicial) {
            this.carregarTiposDocumentoFiscal(
                formulario,
                paisInicial
            );
        }

        paisControl
            .valueChanges
            .pipe(
                tap(() => {
                    this.tiposDocumentoFiscal = [];

                    tipoDocumentoFiscalControl
                        .setValue(
                            '',
                            {
                                emitEvent: false
                            }
                        );
                }),
                switchMap((pais) => {
                    const paisNormalizado =
                        this.normalizarPais(
                            pais
                        );

                    if (!paisNormalizado) {
                        return of([]);
                    }

                    return this.paisService
                        .listarTiposDocumentoFiscal(
                            paisNormalizado
                        )
                        .pipe(
                            catchError(() => {
                                this.toastrService.error(
                                    'Nao foi possivel carregar os tipos de documento fiscal'
                                );

                                return of([]);
                            })
                        );
                }),
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe((tiposDocumentoFiscal) => {
                this.atualizarTiposDocumentoFiscal(
                    formulario,
                    tiposDocumentoFiscal
                );
            });
    }

    private carregarTiposDocumentoFiscal(
        formulario: FormGroup,
        pais: string
    ): void {
        this.paisService
            .listarTiposDocumentoFiscal(
                pais
            )
            .pipe(
                catchError(() => {
                    this.toastrService.error(
                        'Nao foi possivel carregar os tipos de documento fiscal'
                    );

                    return of([]);
                }),
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe((tiposDocumentoFiscal) => {
                this.atualizarTiposDocumentoFiscal(
                    formulario,
                    tiposDocumentoFiscal
                );
            });
    }

    private atualizarTiposDocumentoFiscal(
        formulario: FormGroup,
        tiposDocumentoFiscal:
            TipoDocumentoFiscalOpcao[]
    ): void {
        this.tiposDocumentoFiscal =
            tiposDocumentoFiscal;

        const tipoDocumentoFiscalControl =
            formulario.get(
                'tipoDocumentoFiscal'
            );

        if (!tipoDocumentoFiscalControl) {
            return;
        }

        const tipoDocumentoFiscalAtual =
            tipoDocumentoFiscalControl
                .value;

        const tipoDocumentoFiscalValido =
            tiposDocumentoFiscal.some(
                (tipoDocumentoFiscal) =>
                    tipoDocumentoFiscal.codigo ===
                    tipoDocumentoFiscalAtual
            );

        if (
            tipoDocumentoFiscalAtual &&
            !tipoDocumentoFiscalValido
        ) {
            tipoDocumentoFiscalControl
                .setValue(
                    '',
                    {
                        emitEvent: false
                    }
                );
        }

        if (
            !tipoDocumentoFiscalControl.value &&
            tiposDocumentoFiscal.length === 1 &&
            !this.isVisualizacao
        ) {
            tipoDocumentoFiscalControl
                .setValue(
                    tiposDocumentoFiscal[0].codigo,
                    {
                        emitEvent: false
                    }
                );
        }
    }

    private normalizarPais(
        pais: unknown
    ): string {
        return typeof pais === 'string'
            ? pais.trim().toUpperCase()
            : '';
    }

    private ehCadastroInicial(): boolean {
        return this.cadastroInicial;
    }

    private rotaIndicaCadastroInicial():
        boolean {

        return (
            this.activatedRoute
                .snapshot
                .queryParamMap
                .get('acao') ===
            'nova'
        );
    }

    private voltarParaConfiguracaoInicial():
        void {

        void this.roteador.navigate(
            [
                '/configuracao-inicial'
            ],
            {
                replaceUrl: true
            }
        );
    }

    private navegarParaInicio(): void {
        void this.roteador.navigate(
            [
                '/'
            ],
            {
                replaceUrl: true
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
                this.cadastroInicial = false;

                this.limparEstadoPorTrocaOrganizacao();

                if (!organizacao) {
                    return;
                }

                if (this.podeListar) {
                    this.carregarLista();

                    return;
                }

                if (this.podeCriar) {
                    this.botaoAdicionar();

                    return;
                }

                this.navegarParaInicio();
            });
    }

    private limparEstadoPorTrocaOrganizacao(): void {
        this.cancelar();
        this.limparEmpresaControladora();

        this.lista = [];
        this.totalRegistros = 0;
    }
}