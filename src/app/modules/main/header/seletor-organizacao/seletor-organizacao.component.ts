import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';

import {
    Router
} from '@angular/router';

import {
    ToastrService
} from 'ngx-toastr';

import {
    catchError,
    finalize,
    from,
    Observable,
    of,
    Subject,
    switchMap,
    takeUntil,
    tap,
    throwError
} from 'rxjs';

import {
    ChavePermissao
} from '@/core/autorizacao/models/chave-permissao';

import {
    AutorizacaoService
} from '@/core/autorizacao/services/autorizacao.service';

import {
    PermissoesUsuarioService
} from '@/core/autorizacao/services/permissoes-usuario.service';

import {
    OrganizacaoDisponivel
} from '@/core/organizacao/models/organizacao-disponivel.model';

import {
    ContextoOrganizacaoService
} from '@/core/organizacao/services/contexto-organizacao.service';

import {
    EstadoConfiguracaoInicial
} from '@/domain/configuracao/configuracao-inicial/models/estado-configuracao-inicial.model';

import {
    ConfiguracaoInicialService
} from '@/domain/configuracao/configuracao-inicial/services/configuracao-inicial.service';

@Component({
    selector: 'app-seletor-organizacao',
    templateUrl:
        './seletor-organizacao.component.html',
    styleUrls: [
        './seletor-organizacao.component.scss'
    ],
    standalone: false
})
export class SeletorOrganizacaoComponent
    implements OnInit, OnDestroy {

    organizacoes:
        OrganizacaoDisponivel[] = [];

    organizacaoAtiva:
        OrganizacaoDisponivel | null = null;

    idOrganizacaoSelecionada:
        number | null = null;

    carregando = false;

    trocando = false;

    private readonly destroy$ =
        new Subject<void>();

    constructor(
        private contextoOrganizacaoService:
            ContextoOrganizacaoService,
        private permissoesUsuarioService:
            PermissoesUsuarioService,
        private autorizacaoService:
            AutorizacaoService,
        private configuracaoInicialService:
            ConfiguracaoInicialService,
        private toastr:
            ToastrService,
        private router:
            Router
    ) {
    }

    ngOnInit(): void {
        this.contextoOrganizacaoService
            .retornarOrganizacoesDisponiveis()
            .pipe(
                takeUntil(
                    this.destroy$
                )
            )
            .subscribe((organizacoes) => {
                this.organizacoes =
                    organizacoes;
            });

        this.contextoOrganizacaoService
            .retornarOrganizacaoAtivaObservable()
            .pipe(
                takeUntil(
                    this.destroy$
                )
            )
            .subscribe((organizacao) => {
                this.organizacaoAtiva =
                    organizacao;

                this.idOrganizacaoSelecionada =
                    organizacao?.id ?? null;
            });

        if (
            !this.contextoOrganizacaoService
                .foiCarregado()
        ) {
            this.carregarOrganizacoes();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    get possuiOrganizacoes(): boolean {
        return this.organizacoes.length > 0;
    }

    get exibindoCarregamento(): boolean {
        return (
            this.carregando ||
            this.trocando
        );
    }

    get controleDesabilitado(): boolean {
        return (
            this.exibindoCarregamento ||
            this.organizacoes.length <= 1
        );
    }

    trocarOrganizacao(
        idOrganizacao: number | null
    ): void {
        if (
            !idOrganizacao ||
            this.trocando ||
            idOrganizacao ===
                this.organizacaoAtiva?.id
        ) {
            return;
        }

        const organizacaoAnterior =
            this.organizacaoAtiva;

        let permissoesCarregadas =
            false;

        this.trocando = true;

        this.contextoOrganizacaoService
            .iniciarTrocaOrganizacao();

        try {
            this.contextoOrganizacaoService
                .definirOrganizacaoAtiva(
                    idOrganizacao
                );
        } catch {
            this.trocando = false;

            this.contextoOrganizacaoService
                .finalizarTrocaOrganizacao();

            this.toastr.error(
                'Organização indisponível para o usuário.'
            );

            this.idOrganizacaoSelecionada =
                organizacaoAnterior?.id ??
                null;

            return;
        }

        this.permissoesUsuarioService
            .carregarPermissoes()
            .pipe(
                tap(() => {
                    permissoesCarregadas =
                        true;
                }),
                switchMap(
                    () =>
                        this.configuracaoInicialService
                            .consultar()
                ),
                switchMap(
                    (configuracao) =>
                        this.processarOrganizacaoSelecionada(
                            configuracao
                        )
                ),
                tap(() => {
                    this.contextoOrganizacaoService
                        .confirmarOrganizacaoPronta();
                }),
                catchError((erro: unknown) => {
                    if (!permissoesCarregadas) {
                        return throwError(
                            () => erro
                        );
                    }

                    return from(
                        this.router.navigate(
                            [
                                '/configuracao-inicial'
                            ],
                            {
                                replaceUrl: true
                            }
                        )
                    ).pipe(
                        catchError(() =>
                            of(false)
                        ),
                        switchMap(() => {
                            this.toastr.error(
                                'Não foi possível verificar a configuração da organização.'
                            );

                            return throwError(
                                () => erro
                            );
                        })
                    );
                }),
                finalize(() => {
                    this.trocando = false;

                    this.contextoOrganizacaoService
                        .finalizarTrocaOrganizacao();
                }),
                takeUntil(
                    this.destroy$
                )
            )
            .subscribe({
                next: () => {
                    this.toastr.success(
                        'Organização ativa alterada.'
                    );
                },
                error: () => {
                    if (permissoesCarregadas) {
                        return;
                    }

                    this.reverterOrganizacao(
                        organizacaoAnterior
                    );

                    this.toastr.error(
                        'Não foi possível atualizar as permissões da organização.'
                    );
                }
            });
    }

    rastrearOrganizacao(
        _indice: number,
        organizacao:
            OrganizacaoDisponivel
    ): number {
        return organizacao.id;
    }

    private carregarOrganizacoes(): void {
        this.carregando = true;

        this.contextoOrganizacaoService
            .carregarESelecionarPadrao()
            .pipe(
                finalize(() => {
                    this.carregando = false;
                }),
                takeUntil(
                    this.destroy$
                )
            )
            .subscribe({
                error: () => {
                    this.toastr.error(
                        'Não foi possível carregar as organizações disponíveis.'
                    );
                }
            });
    }

    private processarOrganizacaoSelecionada(
        configuracao:
            EstadoConfiguracaoInicial
    ): Observable<boolean> {

        if (!this.rotaAtualAutorizada()) {
            this.toastr.warning(
                'Seu acesso a esta tela não está disponível na organização selecionada.'
            );

            return from(
                this.router.navigate(
                    [
                        '/'
                    ],
                    {
                        replaceUrl: true
                    }
                )
            );
        }

        if (
            configuracao.proximaEtapa !==
                null &&
            !this.ehRotaPlataforma()
        ) {
            return from(
                this.router.navigate(
                    [
                        '/configuracao-inicial'
                    ],
                    {
                        replaceUrl: true
                    }
                )
            );
        }

        if (
            configuracao.proximaEtapa ===
                null &&
            this.ehRotaConfiguracaoInicial()
        ) {
            const destino =
                this.possuiAcessoEmpresas()
                    ? '/configuracao/empresas'
                    : '/';

            return from(
                this.router.navigate(
                    [
                        destino
                    ],
                    {
                        replaceUrl: true
                    }
                )
            );
        }

        return of(true);
    }

    private reverterOrganizacao(
        organizacaoAnterior:
            OrganizacaoDisponivel | null
    ): void {
        if (!organizacaoAnterior) {
            this.configuracaoInicialService
                .limparEstado();

            this.idOrganizacaoSelecionada =
                null;

            return;
        }

        try {
            this.contextoOrganizacaoService
                .definirOrganizacaoAtiva(
                    organizacaoAnterior.id
                );

            this.configuracaoInicialService
                .consultar()
                .pipe(
                    takeUntil(
                        this.destroy$
                    )
                )
                .subscribe({
                    next: () => {
                        this.contextoOrganizacaoService
                            .confirmarOrganizacaoPronta();
                    },
                    error: () => {
                        this.configuracaoInicialService
                            .limparEstado();
                    }
                });
        } finally {
            this.idOrganizacaoSelecionada =
                organizacaoAnterior.id;
        }
    }

    private rotaAtualAutorizada(): boolean {
        const requisitos =
            this.obterPermissoesDaRotaAtual();

        if (requisitos.permissao) {
            return this.autorizacaoService
                .possuiPermissao(
                    requisitos.permissao
                );
        }

        if (
            requisitos.permissoes.length >
            0
        ) {
            return this.autorizacaoService
                .possuiAlgumaPermissao(
                    requisitos.permissoes
                );
        }

        return true;
    }

    private possuiAcessoEmpresas(): boolean {
        return this.autorizacaoService
            .possuiAlgumaPermissao([
                ChavePermissao
                    .EmpresaCriar,
                ChavePermissao
                    .EmpresaListar
            ]);
    }

    private ehRotaPlataforma(): boolean {
        return this.obterCaminhoAtual()
            .startsWith(
                '/plataforma/'
            );
    }

    private ehRotaConfiguracaoInicial():
        boolean {

        return (
            this.obterCaminhoAtual() ===
            '/configuracao-inicial'
        );
    }

    private obterCaminhoAtual(): string {
        return this.router.url
            .split('?')[0]
            .split('#')[0];
    }

    private obterPermissoesDaRotaAtual(): {
        permissao:
            ChavePermissao | undefined;
        permissoes:
            readonly ChavePermissao[];
    } {
        let rota =
            this.router
                .routerState
                .snapshot
                .root;

        while (rota.firstChild) {
            rota = rota.firstChild;
        }

        return {
            permissao:
                rota.data[
                    'permissao'
                ] as
                    ChavePermissao |
                    undefined,
            permissoes:
                (
                    rota.data[
                        'permissoes'
                    ] as
                        readonly ChavePermissao[] |
                        undefined
                ) ?? []
        };
    }
}