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
    FormGroup,
    Validators
} from '@angular/forms';

import {
    ActivatedRoute,
    Router
} from '@angular/router';

import {
    skip
} from 'rxjs';

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
    Empresa
} from '@/interfaces/interfaces';

import {
    Base
} from '@components/grid/base/base';

import {
    ItemBreadcrumbPagina
} from '@components/cabecalho-pagina/cabecalho-pagina.component';

@Component({
    selector: 'app-empresa',
    templateUrl: './empresa.component.html',
    styleUrls: [
        './empresa.component.scss'
    ],
    standalone: false
})
export class EmpresaComponent extends Base {

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

    private readonly destroyRef =
        inject(
            DestroyRef
        );

    private cadastroInicial = false;

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
            titulo: 'Configuração'
        }
    ];

    endPoint = 'configuracao/empresa';

    coluna = [
        'Nome',
        'Status'
    ];

    override ngOnInit(): void {
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
            return this.builder.group({
                id: [
                    dados.id
                ],
                nome: [
                    dados.nome,
                    [
                        Validators.required,
                        Validators.maxLength(100)
                    ]
                ]
            });
        }

        return this.builder.group({
            nome: [
                '',
                [
                    Validators.required,
                    Validators.maxLength(100)
                ]
            ]
        });
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

        this.lista = [];
        this.totalRegistros = 0;
    }
}