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
    Empresa,
    Estabelecimento,
    Pais,
    TipoDocumentoFiscalOpcao,
    TipoEstabelecimento
} from '@/interfaces/interfaces';

import {
    ItemBreadcrumbPagina
} from '@components/cabecalho-pagina/cabecalho-pagina.component';

import {
    PaisService
} from '../pais/services/pais.service';

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

    private readonly paisService =
        inject(
            PaisService
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
        'Tipo',
        'Pais',
        'Tipo documento',
        'Documento fiscal',
        'Status'
    ];

    lista:
        Estabelecimento[] = [];

    empresas:
        Empresa[] = [];

    paises:
        Pais[] = [];

    tiposDocumentoFiscal:
        TipoDocumentoFiscalOpcao[] = [];

    tiposEstabelecimento: {
        codigo: TipoEstabelecimento;
        nome: string;
    }[] = [
        {
            codigo: 'MATRIZ',
            nome: 'Matriz'
        },
        {
            codigo: 'FILIAL',
            nome: 'Filial'
        },
        {
            codigo: 'UNIDADE',
            nome: 'Unidade'
        }
    ];

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
        this.carregarPaises();
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
        this.tiposDocumentoFiscal = [];

        this.formulario =
            this.criarFormulario();

        this.configurarTiposDocumentoFiscalPorPais(
            this.formulario
        );

        this.empresaPesquisaControl
            .enable({
                emitEvent: false
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

        const dados =
            this.montarDadosFormulario();

        if (id) {
            this.service
                .atualizar({
                    id,
                    nome: dados.nome,
                    tipo: dados.tipo,
                    pais: dados.pais,
                    tipoDocumentoFiscal:
                        dados.tipoDocumentoFiscal,
                    documentoFiscal:
                        dados.documentoFiscal,
                    inscricaoEstadual:
                        dados.inscricaoEstadual,
                    inscricaoMunicipal:
                        dados.inscricaoMunicipal
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
                idEmpresa: dados.idEmpresa,
                nome: dados.nome,
                tipo: dados.tipo,
                pais: dados.pais,
                tipoDocumentoFiscal:
                    dados.tipoDocumentoFiscal,
                documentoFiscal:
                    dados.documentoFiscal,
                inscricaoEstadual:
                    dados.inscricaoEstadual,
                inscricaoMunicipal:
                    dados.inscricaoMunicipal
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
        this.tiposDocumentoFiscal = [];

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

        this.empresaPesquisaControl
            .enable({
                emitEvent: false
            });
    }

    private criarFormulario(
        dados?: Estabelecimento
    ): FormGroup {
        return this.builder.group({
            id: [
                dados?.id ?? null
            ],
            idEmpresa: [
                dados?.idEmpresa ?? null,
                Validators.required
            ],
            nome: [
                dados?.nome ?? '',
                [
                    Validators.required,
                    Validators.maxLength(
                        100
                    )
                ]
            ],
            tipo: [
                dados?.tipo ?? '',
                Validators.required
            ],
            pais: [
                dados?.pais ?? '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(2)
                ]
            ],
            tipoDocumentoFiscal: [
                dados?.tipoDocumentoFiscal ?? ''
            ],
            documentoFiscal: [
                dados?.documentoFiscal ?? '',
                [
                    Validators.maxLength(30)
                ]
            ],
            inscricaoEstadual: [
                dados?.inscricaoEstadual ?? '',
                [
                    Validators.maxLength(30)
                ]
            ],
            inscricaoMunicipal: [
                dados?.inscricaoMunicipal ?? '',
                [
                    Validators.maxLength(30)
                ]
            ]
        });
    }

    private montarDadosFormulario(): {
        idEmpresa: number;
        nome: string;
        tipo: TipoEstabelecimento;
        pais: string;
        tipoDocumentoFiscal: string | null;
        documentoFiscal: string | null;
        inscricaoEstadual: string | null;
        inscricaoMunicipal: string | null;
    } {
        const tipoDocumentoFiscal =
            this.normalizarTextoOpcional(
                this.formulario
                    .get('tipoDocumentoFiscal')
                    ?.value
            );

        const documentoFiscal =
            this.normalizarTextoOpcional(
                this.formulario
                    .get('documentoFiscal')
                    ?.value
            );

        return {
            idEmpresa:
                this.formulario
                    .get('idEmpresa')
                    ?.value,
            nome:
                this.formulario
                    .get('nome')
                    ?.value,
            tipo:
                this.formulario
                    .get('tipo')
                    ?.value,
            pais:
                this.normalizarPais(
                    this.formulario
                        .get('pais')
                        ?.value
                ),
            tipoDocumentoFiscal,
            documentoFiscal,
            inscricaoEstadual:
                this.normalizarTextoOpcional(
                    this.formulario
                        .get('inscricaoEstadual')
                        ?.value
                ),
            inscricaoMunicipal:
                this.normalizarTextoOpcional(
                    this.formulario
                        .get('inscricaoMunicipal')
                        ?.value
                )
        };
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
        this.paises = [];
        this.tiposDocumentoFiscal = [];
        this.totalRegistros = 0;
        this.paginaAtual = 0;
        this.filtro = '';

        this.carregarPaises();
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

                    this.toastr.error(
                        'Nao foi possivel carregar os paises'
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
                        this.criarFormulario(dados);

                    this.empresaPesquisaControl
                        .setValue(
                            dados.empresa ?? '',
                            {
                                emitEvent: false
                            }
                        );

                    this.configurarTiposDocumentoFiscalPorPais(
                        this.formulario
                    );

                    if (visualizacao) {
                        this.formulario
                            .disable();

                        this.empresaPesquisaControl
                            .disable({
                                emitEvent: false
                            });
                    }
                },
                error: () => {
                    this.toastr.error(
                        'Nao foi possivel detalhar o estabelecimento'
                    );
                }
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

        const documentoFiscalControl =
            formulario.get(
                'documentoFiscal'
            );

        if (
            !paisControl ||
            !tipoDocumentoFiscalControl ||
            !documentoFiscalControl
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

                    documentoFiscalControl
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
                                this.toastr.error(
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
                    this.toastr.error(
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

    private normalizarPais(
        pais: unknown
    ): string {
        return typeof pais === 'string'
            ? pais.trim().toUpperCase()
            : '';
    }

    private normalizarTextoOpcional(
        texto: unknown
    ): string | null {
        if (typeof texto !== 'string') {
            return null;
        }

        const textoNormalizado =
            texto.trim();

        return textoNormalizado
            ? textoNormalizado
            : null;
    }
}