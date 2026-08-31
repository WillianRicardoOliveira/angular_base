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
    finalize,
    Subject,
    takeUntil
} from 'rxjs';

import {
    OrganizacaoDisponivel
} from '@/core/organizacao/models/organizacao-disponivel.model';
import {
    ContextoOrganizacaoService
} from '@/core/organizacao/services/contexto-organizacao.service';
import {
    ChavePermissao
} from '@/core/autorizacao/models/chave-permissao';
import {
    AutorizacaoService
} from '@/core/autorizacao/services/autorizacao.service';
import {
    PermissoesUsuarioService
} from '@/core/autorizacao/services/permissoes-usuario.service';

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
        private toastr:
            ToastrService,
        private router:
            Router
    ) {}

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
        return this.carregando || this.trocando;
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

        try {
            this.contextoOrganizacaoService
                .definirOrganizacaoAtiva(
                    idOrganizacao
                );
        } catch {
            this.toastr.error(
                'Organização indisponível para o usuário.'
            );

            this.idOrganizacaoSelecionada =
                organizacaoAnterior?.id ?? null;

            return;
        }

        this.trocando = true;

        this.permissoesUsuarioService
            .carregarPermissoes()
            .pipe(
                finalize(() => {
                    this.trocando = false;
                }),
                takeUntil(
                    this.destroy$
                )
            )
            .subscribe({
                next: () => {
                    this.validarRotaAtual();
                    this.toastr.success(
                        'Organização ativa alterada.'
                    );
                },
                error: () => {
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
        organizacao: OrganizacaoDisponivel
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

    private reverterOrganizacao(
        organizacaoAnterior:
            OrganizacaoDisponivel | null
    ): void {
        if (!organizacaoAnterior) {
            this.idOrganizacaoSelecionada = null;
            return;
        }

        try {
            this.contextoOrganizacaoService
                .definirOrganizacaoAtiva(
                    organizacaoAnterior.id
                );
        } finally {
            this.idOrganizacaoSelecionada =
                organizacaoAnterior.id;
        }
    }

    private validarRotaAtual(): void {
        const permissao =
            this.obterPermissaoDaRotaAtual();

        if (
            permissao &&
            !this.autorizacaoService
                .possuiPermissao(permissao)
        ) {
            this.toastr.warning(
                'Seu acesso a esta tela não está disponível na organização selecionada.'
            );

            void this.router.navigate(['/']);
        }
    }

    private obterPermissaoDaRotaAtual():
        ChavePermissao | undefined {

        let rota =
            this.router
                .routerState
                .snapshot
                .root;

        while (rota.firstChild) {
            rota = rota.firstChild;
        }

        return rota.data[
            'permissao'
        ] as ChavePermissao | undefined;
    }
}